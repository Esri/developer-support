define([
        "dojo/_base/declare",
        "esri/config",
        "esri/geometry/webMercatorUtils",
        "esri/request",
        "dojo/Deferred",
        "esri/symbols/PictureMarkerSymbol"
    ],
    function(declare, esriConfig, webMercatorUtils, esriRequest, Deferred, PictureMarkerSymbol) {
        return declare(null, {

            constructor: function(options){
                options = options || {};

                this.printService = options.printService || "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"; // default seat geek range is 30mi

                esriConfig.defaults.io.corsEnabledServers.push("sampleserver6.arcgisonline.com");

                that = this;
            },

            getXY: function(options){

                var xy, location, deferred,
                    geocoderService = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

                if(options.longitude && options.latitude) {
                    deferred = new Deferred();
                    xy = webMercatorUtils.lngLatToXY(options.longitude, options.latitude);
                    deferred.resolve(xy);
                    return deferred.promise;

                }else if(options.address){
                    deferred = new Deferred();
                    esriRequest({
                        "url": geocoderService,
                        "content": {
                            SingleLine: options.address,
                            f: "json",
                            outSR: '{"wkid":102100}',
                            outFields: "Match_addr",
                            Addr_type: "StAddr,City",
                            maxLocations:1
                        }
                    }).then(function(response, io){
                        location = response.candidates[0].location;
                        xy = [location.x, location.y];
                        deferred.resolve(xy);
                    }, function(error, io){
                        return error;
                    });

                    return deferred.promise;

                }else{
                    deferred = new Deferred();
                    xy = webMercatorUtils.lngLatToXY(-3.626666, 40.432781);
                    deferred.resolve(xy);
                    return deferred.promise;
                }
            },

            getImage: function(options) {
                var extentValue, xy, z, extents, webmap, format, layoutTemplate, f, params, request;
                var deferred = new Deferred();

                options = options || {};

                this.getXY(options).then(function(response){
                    var deferred;
                    xy = response;

                    extents = [100, 200, 300, 400, 500, 1000,10000,24000,100000,250000,500000,750000,1000000,3000000,10000000];
                    extentValue = extents[2];
                    z = options.zoom || 5;

                    if(typeof(z)==="number" && (z>0 && z < extents.length)){
                        extentValue = extents[z-1];
                    }

                    webmap = options.webmap || that.getDefaultWebmap(xy,extentValue);

                    if(options.markers){
                        webmap.operationalLayers.push(that.addMarkers(options.markers));
                    }

                    if(options.size){
                        webmap.exportOptions.outputSize = options.size;
                    }

                    webmap.operationalLayers[0].url = that.getBasemapService(options);
                    format = options.format || "PNG32";
                    layoutTemplate = options.layoutTemplate || "MAP_ONLY";
                    f = options.f || "json";

                    params = {
                        f: f,
                        format: format,
                        Layout_Template: layoutTemplate,
                        Web_Map_as_JSON: JSON.stringify(webmap)
                    };

                    deferred = new Deferred();
                    request = new XMLHttpRequest();
                    request.onreadystatechange = function()
                    {
                        if (request.readyState == 4 && request.status == 200)
                        {
                            obj = JSON.parse(request.responseText);
                            deferred.resolve(obj.results[0].value.url);
                        }
                    };
                    request.open("POST", that.printService+'/execute', true);
                    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    request.send(that.parseParams(params));
                    return deferred.promise;

                }).then(function(response){
                    deferred.resolve(response)
                });
                return deferred.promise;

            },

            parseParams: function(obj){
                var pairs = [];

                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        var k = encodeURIComponent(prop),
                            v = encodeURIComponent(obj[prop]);
                        pairs.push( k + "=" + v);
                    }
                }
                return pairs.join("&");
            },


            getBasemapService: function(options){
                switch(options.basemap){
                    case 'satellite':
                        return "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
                    case 'topo':
                        return "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";
                    case 'light-gray':
                        return "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer";
                    case 'dark-gray':
                        return "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer";
                    case 'streets':
                        return "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";
                    case 'hybrid':
                        return "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer";
                    case 'oceans':
                        return "http://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer";
                    case 'national-geographic':
                        return "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer";
                    case 'osm':
                        return "http://a.tile.openstreetmap.org/";
                    default:
                        return "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";
                }
            },

            getDefaultWebmap: function(xy,extentValue){
                return {
                    "mapOptions": {
                        "showAttribution": false,
                        "extent": {
                            "xmin": xy[0] - extentValue,
                            "ymin": xy[1] - extentValue,
                            "xmax": xy[0] + extentValue,
                            "ymax": xy[1] + extentValue,
                            "spatialReference": {
                                "wkid": 102100,
                                "latestWkid": 3857
                            }
                        },
                        "spatialReference": {
                            "wkid": 102100,
                            "latestWkid": 3857
                        }
                    },
                    "operationalLayers": [
                        {
                            "id": "Ocean",
                            "title": "Ocean",
                            "opacity": 1,
                            "url": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                        }
                    ],
                    "exportOptions": {
                        "outputSize": [
                            300,
                            300
                        ],
                        "dpi": 96
                    }
                }
            },
            /*
            TODO: be able to load any image
            convertImgToBase64URL: function(url, callback, outputFormat){
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function(){
                    var canvas = document.createElement('CANVAS'),
                        ctx = canvas.getContext('2d'), dataURL;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                    callback(dataURL);
                    canvas = null;
                };
                img.src = url;
            },
            */

            base64Icon: function(color) {
                switch (color) {
                    case "purple":
                        return {
                            type:"image/png",
                            imageData: "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"
                        };
                    case "orange":
                        return {
                            type:"image/png",
                            imageData: "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"
                        }
                }


            },

            addMarkers: function(markers){
                var i, symbol;
                var layer = {
                    "id": "map_graphics",
                    "opacity": 1,
                    "minScale": 0,
                    "maxScale": 0,
                    "featureCollection": {
                        "layers": [
                            {
                                "layerDefinition": {
                                    "name": "pointLayer",
                                    "geometryType": "esriGeometryPoint"
                                },
                                "featureSet": {
                                    "geometryType": "esriGeometryPoint",
                                    "features": []
                                }
                            }
                        ]
                    }
                };

                for(i = 0 ; i < markers.length ; i++){
                    symbol = this.base64Icon(markers[i].color);
                    xy = webMercatorUtils.lngLatToXY(markers[i].longitude, markers[i].latitude);
                    f = {
                        "geometry": {
                            "x": xy[0],
                            "y": xy[1],
                            "spatialReference": {
                                "wkid": 102100,
                                "latestWkid": 3857
                            }
                        },
                        "symbol": {
                            "type": "esriPMS",
                            "url": markers[i].color + ".png",
                            "contentType": symbol.type,
                            "width": markers[i].width || 12,
                            "height": markers[i].height || 24,
                            "xoffset": markers[i].xoffset || 0,
                            "yoffset": markers[i].yoffset || 0,
                            "angle": markers[i].angle || 0,
                            "imageData": symbol.imageData
                        }
                    };
                    layer.featureCollection.layers[0].featureSet.features.push(f);
                }

                return layer;
            }
        });
    }
);