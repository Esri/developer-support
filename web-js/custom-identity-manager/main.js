$(window).load(function() {
  $('#signInModal').modal('show');

  //submit the form
  $("#submit").click(init);
  $('#pwd').keypress(function(e) {
    var key = e.which;
    if (key == 13) // the enter key code
    {
      init();
      return false;
    }
  });

  function init() {
    require(["esri/map",
      "esri/arcgis/utils",
      "esri/request",
      "esri/IdentityManager",
      "dojo/domReady!"
    ], function(Map, arcgisUtils, esriRequest, IdentityManager) {

      //obtain values from login modal
      var formValArray = $("#loginForm").serializeArray();
      var webMapVal = formValArray[0].value;
      var usrVal = formValArray[1].value;
      var pwdVal = formValArray[2].value;

      $('#signInModal').modal('hide');

      //generate a token based on username and password
      var requestHandle = esriRequest({
        url: "https://www.arcgis.com/sharing/rest/generateToken",
        content: {
          request: "generateToken",
          username: usrVal,
          password: pwdVal,
          referer: "http://esri.github.io/",
          f: "json"
        },
        handleAs: "json",
      }, {
        usePost: true
      });

      requestHandle.then(requestSucceeded, requestFailed);

      //if succeeds, register token
      function requestSucceeded(evt) {
        console.log(evt);

        IdentityManager.registerToken({
          expires: evt.expires,
          server: "http://www.arcgis.com/sharing/rest",
          ssl: evt.ssl,
          token: evt.token,
          userId: usrVal
        });
        return usePortal();
      }

      //load the secured resource
      function usePortal() {
        arcgisUtils.createMap(webMapVal, "mapViewDiv");
      }

      function requestFailed(evt) {
        console.log("failed", evt);
      }

    }); //require
  } //init

}); //window load
