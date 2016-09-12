var profile = (function(){
	var testResourceRe = /^bootstrap\/tests\//;

    var ignore = function(filename, mid){
        var list = {
            "bootstrap/.gitignore" : true
        };
        return (mid in list) ||
            /^bootstrap\/vendor\//.test(mid);
    };

    var test = function(filename, mid){
        var list = {
            "bootstrap/tests"     : true
        };
        return (mid in list) ||
            testResourceRe.test(mid);
    };

    var copyOnly = function(filename, mid){
        var list = {
			"bootstrap/bootstrap.profile" : true,
            "bootstrap/package.json"      : true,
            "bootstrap/LICENSE"           : true,
            "bootstrap/README.md"         : true
        };
        return (mid in list) ||
            /(png|jpg|jpeg|gif|tiff)$/.test(filename);
    };

    var miniExclude = function(filename, mid){
        var list = {
            "bootstrap/LICENCE"   : true,
            "bootstrap/README.md" : true
        };
        return (mid in list);
    };

    return {
        resourceTags:{

            ignore: function(filename, mid){
				return ignore(filename, mid);
            },

            test: function(filename, mid){
				return test(filename, mid);
            },

            copyOnly: function(filename, mid){
                return copyOnly(filename, mid);
            },

            miniExclude: function(filename, mid){
                return miniExclude(filename, mid);
            },

            amd: function(filename, mid){
                return !test(filename, mid) &&
                    !copyOnly(filename, mid) &&
                    !ignore(filename, mid) &&
                    (/\.js$/).test(filename);
            }
        }
    };
})();