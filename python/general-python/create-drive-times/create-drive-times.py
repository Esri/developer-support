"""
Importing concepts found at:
GitHub Developer Support
https://github.com/Esri/developer-support/tree/gh-pages/python/general-python/update-webmap-json
https://developers.arcgis.com/rest/analysis/api-reference/programmatically-accessing-analysis-services.htm
https://developers.arcgis.com/rest/analysis/api-reference/create-drivetime.htm
"""
import urllib
import urllib2
import json
import httplib
import time
import contextlib
import string
import smtplib

class ArcGISOnline(object):

    def __init__(self, Username, Password):
        self.username = Username
        self.password = Password
        self.__token = self.generateToken(self.username, self.password)['token']
        self.__protocol = self.__useProtocol()
        self.__orgInfo = self.__GetInfo()
        self.__short = self.__orgInfo['urlKey']
        self.__analysis_url = self.__orgInfo['helperServices']['analysis']['url']


    def submit_request(self, request):
        """ Returns the response from an HTTP request in json format."""
        with contextlib.closing(urllib2.urlopen(request)) as response:
            job_info = json.load(response)
            return job_info

    @staticmethod
    def generateToken(username, password):
        '''Generate a token using urllib modules for the input
        username and password'''

        url = "https://arcgis.com/sharing/generateToken"
        data = {'username': username,
            'password': password,
            'referer' : 'https://arcgis.com',
            'expires' : 1209600,
            'f': 'json'}
        data = urllib.urlencode(data)
        request = urllib2.Request(url, data)
        response = urllib2.urlopen(request)

        return json.loads(response.read())

    @property
    def token(self):
        '''Makes the non-public token read-only as a public token property'''
        return self.__token

    @property
    def AnalysisURL(self):
        '''Makes the non-public token read-only as a public token property'''
        return self.__analysis_url

    def __useProtocol(self):
        tokenResponse = self.generateToken(self.username, self.password)
        if tokenResponse['ssl']:
            ssl = 'https'
        else:
            ssl = 'http'
        return ssl

    def __GetInfo(self):
        '''Get information about the specified organization
        this information includes the Short name of the organization (['urlKey'])
        as well as the organization ID ['id']'''

        URL= '{}://arcgis.com/sharing/rest/portals/self?f=json&token={}'.format(self.__protocol,self.__token)
        request = urllib2.Request(URL)
        response = urllib2.urlopen(request)
        return json.loads(response.read())

    def analysis_job(self, analysis_url, task, params):
        """ Submits an Analysis job and returns the job URL for monitoring the job
            status in addition to the json response data for the submitted job."""

        # Unpack the Analysis job parameters as a dictionary and add token and
        # formatting parameters to the dictionary. The dictionary is used in the
        # HTTP POST request. Headers are also added as a dictionary to be included
        # with the POST.
        #
        print("Submitting analysis job...")

        params["f"] = "json"
        params["token"] = self.__token
        headers = {"Referer":"http://www.arcgis.com"}
        task_url = "{}/{}".format(analysis_url, task)
        submit_url = "{}/submitJob?".format(task_url)
        request = urllib2.Request(submit_url, urllib.urlencode(params), headers)
        analysis_response = self.submit_request(request)
        if analysis_response:
            # Print the response from submitting the Analysis job.
            #
            print(analysis_response)
            return task_url, analysis_response
        else:
            raise Exception("Unable to submit analysis job.")

    def analysis_job_status(self, task_url, job_info):
        """ Tracks the status of the submitted Analysis job."""

        if "jobId" in job_info:
            # Get the id of the Analysis job to track the status.
            #
            job_id = job_info.get("jobId")
            job_url = "{}/jobs/{}?f=json&token={}".format(task_url, job_id, self.__token)
            request = urllib2.Request(job_url)
            job_response = self.submit_request(request)

            # Query and report the Analysis job status.
            #
            if "jobStatus" in job_response:
                while not job_response.get("jobStatus") == "esriJobSucceeded":
                    time.sleep(5)
                    request = urllib2.Request(job_url)
                    job_response = self.submit_request(request)
                    print(job_response)

                    if job_response.get("jobStatus") == "esriJobFailed":
                        raise Exception("Job failed.")
                    elif job_response.get("jobStatus") == "esriJobCancelled":
                        raise Exception("Job cancelled.")
                    elif job_response.get("jobStatus") == "esriJobTimedOut":
                        raise Exception("Job timed out.")

                if "results" in job_response:
                    return job_response
            else:
                raise Exception("No job results.")
        else:
            raise Exception("No job url.")

    def analysis_job_results(self, task_url, job_info):
        """ Use the job result json to get information about the feature service
            created from the Analysis job."""

        # Get the paramUrl to get information about the Analysis job results.
        #
        if "jobId" in job_info:
            job_id = job_info.get("jobId")
            if "results" in job_info:
                results = job_info.get("results")
                result_values = {}
                for key in results.keys():
                    param_value = results[key]
                    if "paramUrl" in param_value:
                        param_url = param_value.get("paramUrl")
                        result_url = "{}/jobs/{}/{}?token={}&f=json".format(task_url,
                                                                            job_id,
                                                                            param_url,
                                                                            self.__token)
                        request = urllib2.Request(result_url)
                        param_result = self.submit_request(request)
                        job_value = param_result.get("value")
                        result_values[key] = job_value
                return result_values
            else:
                raise Exception("Unable to get analysis job results.")
        else:
            raise Exception("Unable to get analysis job results.")

    def GetTravelModes(self, FORMOFTRAVEL):
        url = "http://logistics.arcgis.com/arcgis/rest/services/World/Utilities/GPServer/GetTravelModes/execute?token={0}&f=pjson".format(self.__token)
        request = urllib2.Request(url)
        response = urllib2.urlopen(request)
        responseJ = json.loads(response.read())
        for mode in responseJ['results'][0]['value']['features']:
            if mode['attributes']['Name'] == FORMOFTRAVEL:
                return mode['attributes']['TravelMode']


    def CreateDriveTimes(self, featureLayerURL, WHERE_CLAUSE, breakValues, breakUnits, overlapPolicy, OUTPUTNAME):
        data = {}
        data['inputLayer'] = {'url' : featureLayerURL,
                              'filter' : WHERE_CLAUSE
                              }
        data['travelMode'] = self.GetTravelModes("Driving Time")
        data['breakValues'] = breakValues
        data['breakUnits'] = breakUnits
        data['overlapPolicy'] = overlapPolicy
        data['outputName'] = {"serviceProperties": {"name": OUTPUTNAME}}
        task_url, job_info = self.analysis_job(self.__analysis_url, "CreateDriveTimeAreas", data)
        job_info = self.analysis_job_status(task_url, job_info)
        job_values = self.analysis_job_results(task_url, job_info)
        return job_values



if __name__ == '__main__':
    username = "thisIsAUserName"
    password = "MyPassword!"
    onlineAccount = ArcGISOnline(username, password)
    jobResults = onlineAccount.CreateDriveTimes("URLTOFEATURESERVICE", "OBJECTID = 4", [5.0, 10.0, 15.0], "Minutes", "Split", "ThisIsAnOutput")
    print "DONE"
