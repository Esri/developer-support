using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Collections.Specialized;
using System.Runtime.Serialization;
using Newtonsoft.Json;


namespace AGOL
{
    class AGOL
    {
        private string _token;
        private string _username;
        private string _password;
        public organizationInformation orgInfo;
        public Services orgServices;
        public Users users;


        public string Token
        {
            get
            {
                return _token;
            }
        }

        public string Username
        {
            get
            {
                return _username;
            }
            set
            {
                _username = value;
            }
        }

        public string Password
        {
            get
            {
                return _password;
            }
            set
            {
                _password = value;
            }
        }
        public AGOL(string UserName, string PassWord)
        {
            _username = UserName;
            _password = PassWord;
            _token = GetToken(UserName, PassWord);
            orgInfo = _getOrgInfo(_token);
            orgServices = _getServices();
            users = _getUsers();
        }



        public string GetToken(string username, string password)
        {

            var data = new NameValueCollection();
            data["username"] = Username;
            data["password"] = Password;
            data["referer"] = "https://www.arcgis.com";
            data["f"] = "json";

            TokenInfo x = JsonConvert.DeserializeObject<TokenInfo>(_getResponse(data, "https://arcgis.com/sharing/rest/generateToken"));
            return x.token; ;
        }

        private organizationInformation _getOrgInfo(string token)
        {
            var data = new NameValueCollection();
            data["token"] = token;
            data["f"] = "json";

            organizationInformation x = JsonConvert.DeserializeObject<organizationInformation>(_getResponse(data, "http://www.arcgis.com/sharing/rest/portals/self"));
            return x;
        }

        //

        private Services _getServices()
        {
            var data = new NameValueCollection();
            data["token"] = this._token;
            data["f"] = "json";

            Services x = JsonConvert.DeserializeObject<Services>(_getResponse(data, "http://services.arcgis.com/" + this.orgInfo.id + "/ArcGIS/rest/services"));
            return x;
        }

        private Users _getUsers()
        {
            var data = new NameValueCollection();
            data["f"] = "pjson";
            data["start"] = "1";
            data["sortOrder"] = "asc";
            data["num"] = "100";
            data["sortField"] = "fullname";
            data["token"] = this._token;
            int nextStart;
            Users z;
            z = new Users();
            nextStart = 1;
            List<User> users = new List<User>();
            while( nextStart != -1)
            {
                Users x = JsonConvert.DeserializeObject<Users>(_getResponse(data, "http://"+ this.orgInfo.urlKey +".maps.arcgis.com/sharing/rest/portals/self/users"));
                z.num = x.num;
                z.total = x.total;
                foreach (User user in x.users)
                {
                    users.Add(user);
                }
                nextStart = x.nextStart;
                data["start"] = x.nextStart.ToString();
            }

            z.users = users;
            return z;
        }

        private string _getResponse(NameValueCollection data, string url)
        {
            string responseData;
            var webClient = new WebClient();
            var response = webClient.UploadValues(url, data);
            responseData = System.Text.Encoding.UTF8.GetString(response);
            return responseData;
        }

        //Classes created from the JSON

        public class TokenInfo
        {
            public string token { get; set; }
            public long expires { get; set; }
            public bool ssl { get; set; }
        }

        public class organizationInformation
        {
            public string access { get; set; }
            public bool allSSL { get; set; }
            public double availableCredits { get; set; }
            public string backgroundImage { get; set; }
            public string basemapGalleryGroupQuery { get; set; }
            public string bingKey { get; set; }
            public bool canListApps { get; set; }
            public bool canListData { get; set; }
            public bool canListPreProvisionedItems { get; set; }
            public bool canProvisionDirectPurchase { get; set; }
            public bool canSearchPublic { get; set; }
            public bool canShareBingPublic { get; set; }
            public bool canSharePublic { get; set; }
            public bool canSignInArcGIS { get; set; }
            public bool canSignInIDP { get; set; }
            public string colorSetsGroupQuery { get; set; }
            public bool commentsEnabled { get; set; }
            public long created { get; set; }
            public string culture { get; set; }
            public string customBaseUrl { get; set; }
            public int databaseQuota { get; set; }
            public int databaseUsage { get; set; }
            public string description { get; set; }
            public string featuredGroupsId { get; set; }
            public string featuredItemsGroupQuery { get; set; }
            public string galleryTemplatesGroupQuery { get; set; }
            public string helpBase { get; set; }
            public string homePageFeaturedContent { get; set; }
            public int homePageFeaturedContentCount { get; set; }
            public int httpPort { get; set; }
            public int httpsPort { get; set; }
            public string id { get; set; }
            public string ipCntryCode { get; set; }
            public bool isPortal { get; set; }
            public string layerTemplatesGroupQuery { get; set; }
            public int maxTokenExpirationMinutes { get; set; }
            public long modified { get; set; }
            public string name { get; set; }
            public string portalHostname { get; set; }
            public string portalMode { get; set; }
            public string portalName { get; set; }
            public object portalThumbnail { get; set; }
            public string region { get; set; }
            public bool showHomePageDescription { get; set; }
            public string staticImagesUrl { get; set; }
            public long storageQuota { get; set; }
            public long storageUsage { get; set; }
            public bool supportsHostedServices { get; set; }
            public bool supportsOAuth { get; set; }
            public string symbolSetsGroupQuery { get; set; }
            public string templatesGroupQuery { get; set; }
            public string thumbnail { get; set; }
            public string units { get; set; }
            public string urlKey { get; set; }
            public bool useStandardizedQuery { get; set; }
        }


        public class Service
        {
            public string name { get; set; }
            public string type { get; set; }
            public string url { get; set; }
        }

        public class Services
        {
            public double currentVersion { get; set; }
            public List<Service> services { get; set; }
        }

        public class User
        {
            public string username { get; set; }
            public string fullName { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string preferredView { get; set; }
            public string description { get; set; }
            public string email { get; set; }
            public string userType { get; set; }
            public object idpUsername { get; set; }
            public object favGroupId { get; set; }
            public object lastLogin { get; set; }
            public bool validateUserProfile { get; set; }
            public string access { get; set; }
            //public long storageUsage { get; set; }
           // public object storageQuota { get; set; }
            public string orgId { get; set; }
            public string role { get; set; }
            public bool disabled { get; set; }
            public List<object> tags { get; set; }
            public object culture { get; set; }
            public object region { get; set; }
            public string units { get; set; }
            public object thumbnail { get; set; }
            public object created { get; set; }
            public object modified { get; set; }
            public List<object> groups { get; set; }
        }

        public class Users
        {
            public int total { get; set; }
            public int start { get; set; }
            public int num { get; set; }
            public int nextStart { get; set; }
            public List<User> users { get; set; }
        }

    }
}
