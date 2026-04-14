\# Socrata provider SODA3 API



This sample provider interfaces with any publicly available data on open

data websites such as data.lacity.org and integrates it with ArcGIS

Enterprise.



This sample extends the Socrata Provider sample that uses SODA2 API to use the SODA3 API which returns more than 1000 records but requires authentication. 

Sources that provide Socrata endpoints such as data.lacity.org are compatable



\## Register and create a Socrata Account to obtain API Key and Secret



1. Click on the sign in/log in button and follow the prompts to create your account.
2. Once account is created click on your name in the top right corner then select developer settings
3. Click the blue button to Create new API Key
4. This will give you an API Key and an API Secret. Both will be needed us a pseudo username/password to get access to the authenticated SODA3 endpoint.



\## Set up the Provider



1\.  Run the `cdf createapp socrata-app` command to create a new custom

&#x20;   data app or use an existing custom data app.

2\.  Run the `cdf createprovider socrata-provider` command to create a

&#x20;   custom data provider.

3\.  Navigate to the \*\*providers/socrata-provider\*\* directory in a

&#x20;   command prompt and run the `npm i config lodash` command.

4\.  Copy the contents of the \*\*src\*\* folder in the provided source code into

&#x20;   the \*\*src\*\* folder inside your \*\*providers/socrata-provider/src\*\*

&#x20;   directory.



\## Configure Provider



1\.  In the \*\*providers/socrata-provider/cdconfig.json\*\* file, set the value of the

&#x20;   `properties.hosts` field to `true` and

&#x20;   `properties.disableIdParam` field to `false`.

2\. In \*\*providers/socrata-provider/src/model.js\*\* please add to the variables your API Key and API Secret. These will be appended to the headers to authenticate the request.



\## Test the Provider



1\.  Navigate to the \*\*socrata-app\*\* directory in a command prompt and

&#x20;   run the `npm start` command to start the custom data app

2\.  In a web browser, navigate to

&#x20;   http://localhost:8080/socrata-provider/rest/services/data.lacity.org/fdwe-pgcu/FeatureServer/0/query

&#x20;   and verify that the Socrata provider is returning data points.



\## Build and Deploy the Custom Data Provider Package File



1\.  Stop the custom data app if it's running.

2\.  Open a command prompt and navigate to the custom data app directory.

3\.  Run the `cdf export socrata-provider` command.

4\.  In a web browser, navigate to the ArcGIS Server Administrator

&#x20;   Directory and sign in as an administrator.

5\.  Click \*\*uploads \\> upload\*\*.

6\.  On the \*\*Upload Item\*\* page, click \*\*Choose File\*\* and select the

&#x20;   \*\*socrata-provider.cdpk\*\* file. Optionally, provide a description in

&#x20;   the \*\*Description\*\* text box.

7\.  Click \*\*Upload\*\*. Once the file is uploaded, you will be directed to

&#x20;   a page with the following header: \*\*Uploaded item - \\<item\_id\\>\*\* .

&#x20;   Copy the item id.

8\.  Browse back to the root of the Administrator Directory and then

&#x20;   click \*\*services \\> types \\> customdataproviders\*\*.

9\.  On the \*\*Registered Customdata Providers\*\* page, click register and

&#x20;   paste the item id into the \*\*Id of uploaded item\*\* field.

10\. Click \*\*Register\*\*.



\## Create Feature Service



1\.  Browse back to the root of the Administrator Directory and click

&#x20;   \*\*services \\> createService\*\*.



2\.  On the \*\*Create Service\*\* page, copy and paste the following JSON

&#x20;   into the \*\*Service (in JSON format)\*\* text box.



&#x20;   ```json

&#x20;   {

&#x20;     "serviceName": "LosAngelesProperties",

&#x20;     "type": "FeatureServer",

&#x20;     "description": "",

&#x20;     "capabilities": "Query",

&#x20;     "provider": "CUSTOMDATA",

&#x20;     "clusterName": "default",

&#x20;     "minInstancesPerNode": 0,

&#x20;     "maxInstancesPerNode": 0,

&#x20;     "instancesPerContainer": 1,

&#x20;     "maxWaitTime": 60,

&#x20;     "maxStartupTime": 300,

&#x20;     "maxIdleTime": 1800,

&#x20;     "maxUsageTime": 600,

&#x20;     "loadBalancing": "ROUND\_ROBIN",

&#x20;     "isolationLevel": "HIGH",

&#x20;     "configuredState": "STARTED",

&#x20;     "recycleInterval": 24,

&#x20;     "recycleStartTime": "00:00",

&#x20;     "keepAliveInterval": 1800,

&#x20;     "private": false,

&#x20;     "isDefault": false,

&#x20;     "maxUploadFileSize": 0,

&#x20;     "allowedUploadFileTypes": "",

&#x20;     "properties": {

&#x20;       "disableCaching": "true"

&#x20;     },

&#x20;     "jsonProperties": {

&#x20;       "customDataProviderInfo": {

&#x20;         "dataProviderName": "socrata-provider",

&#x20;         "dataProviderHost": "data.lacity.org",

&#x20;         "dataProviderId": "fdwe-pgcu"

&#x20;       }

&#x20;     },

&#x20;     "extensions": \[],

&#x20;     "frameworkProperties": {},

&#x20;     "datasets": \[]

&#x20;   }

&#x20;   ```



3\.  Click \*\*Create.\*\*



\## Consume Feature Service



To access the socrata feature service that you created in the previous

section, use the appropriate URL (e.g.,

\*\*https://\\<domain\_or\_machine\_name\\>/\\<webadaptor\_name\\>/rest/services/LosAngelesProperties/FeatureServer\*\*).

You can use this URL to consume data from Socata in ArcGIS clients like

ArcGIS Pro, ArcGIS Online, and ArcGIS Enterprise.

