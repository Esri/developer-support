var render;
require([
    "esriES/staticmap",
    'jquery',
    'jsrender',
    "dojo/domReady!"
], function(StaticMap, $, jsrender) {
    var options, staticMap = new StaticMap();
    render = jsrender;

    //*****************************************
    //  First default map
    //*****************************************
    options = {
        basemap: "streets",
        zoom: 3,
        address: "Balcon de Europa, Nerja",
        markers:[
            {
                latitude: 36.744426,
                longitude: -3.875497,
                color: "orange",
                yoffset: 10
            },
            {
                latitude: 36.745053,
                longitude : -3.877257,
                color: "purple"
            }
        ],
        size: [510, 250],
        format: "PNG32"
    };


    $("#img").css("width", options.size[0]);
    $("#img").css("height", options.size[1]);

    staticMap.getImage(options).then(function (imageURL) {
        document.getElementById("img").src = imageURL;
    });

    //*****************************************
    //  Form interactions
    //*****************************************

    $("#locationType").change(function(){
        $(".locationType").hide();
        $("#" + $("#locationType").val()).show();
    });

    $("#addMarker").click(function(e){
        var template, htmlOutput;

        e.preventDefault();
        template = jsrender.templates("#markerTmpl");

        htmlOutput = template.render({
            markerId: $("#markers li").length
        });

        $("#markers").append(htmlOutput);
    });

    //*****************************************
    //  Generate new image
    //*****************************************
    $("form").submit(function(e){
        var options, temaplte, htmlOutput;

        e.preventDefault();

        options = {
            basemap: $("#basemap").val(),
            zoom: parseInt($("#zoom").val()),
            markers: [],
            size: [ $("#width").val(),  $("#height").val()],
            format: $("#format").val()
        };

        $("#markers li").each(function(i, elem){
            options.markers.push({
                latitude: $($("#markers li")[0]).find(".lat").val(),
                longitude: $($("#markers li")[0]).find(".lon").val(),
                color: $($("#markers li")[0]).find(".color").val()
            });
        });

        if($("#locationType").val()=="typeAddress"){
            options.address = $("#address").val();
        }else{
            options.latitude = $("#latitude").val();
            options.longitude = $("#longitude").val()
        }

        // Show preload image
        $("#img").attr("src", "")
        $("#img").css("width", options.size[0]);
        $("#img").css("height", options.size[1]);

        // Update the printed "Source code"
        template = jsrender.templates("#codeTmpl");

        htmlOutput = template.render({
            options: JSON.stringify(options, null, "  ")
        });

        $("#code").html(htmlOutput);
        $("#code").removeClass("prettyprinted");
        PR.prettyPrint()

        staticMap.getImage(options).then(function (imageURL) {
            $("#img").attr("src", imageURL);
            $("#imgURL").attr("href", imageURL);
        });
        return -1;
    });
});

var removeMarker = function(id){
    $(id).parent().parent().remove()
};