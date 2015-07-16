var fs = require('fs');
var parse = require('csv-parse');
var request = require('request');

var Geocode = (function(){

	var chunkCount;
	var count = 0;

    function format_to_json(chunck){
    	converted_chunk = {};
    	records = []
    	for(i=0; i < chunck.length; i++){
    		var chunk_item = chunck[i];
    		var record = {};
    		record.attributes = chunk_item;
    		records.push(record);
    	}
		converted_chunk.records = records;
		return converted_chunk;
	};

    function send(chunks, callback) {
    	results = [];
    	for(i = 0; i < chunks.length; i++){
    		var chunk = chunks[i];
    		var records = JSON.stringify(chunk);
    		
    		//https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses
		    
		    request.post({
		    	url:'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses', 
		    	form: {
		   			addresses:records,
		    		sourceCountry: "USA",
		    		token: "Sib8OEuolBCnqyRMvghmv_TzwQ8CanSc3cCcQbRbmg",
		    		f:"pjson"
		   		}
		   	}, function(err, httpResponse, data){
		    	if (err) {
		    		return console.error('sadly failed to geocode chunck:', err);
		   		}
		   		
		   		results.push(data);

		   		count = count + 1;
		   		console.log("processing ...." +  count);

		   		if (count == chunks.length) {
			   		console.log("i: " + i + "\tchunks: " + chunks.length);
			   		console.log("Calling writeChunks");
			   		wirteChunksToFile(data);
		   			callback();
			   	}
		    });
    	}
    }

    function wirteChunksToFile(data) {
    	fs.writeFile("results.txt", data, function(err) {
    		if (err) {
    			return console.log(err);
    		}
    		console.log("The file was saved!");
    	});
    }


    return {
		parse_csv_file:function(file, handler){
			var parser = parse({delimiter: ','}, function(err, data){
				if(data){
					handler(data);
				}
			});
			fs.createReadStream(file).pipe(parser);
		},
		submit_job:function(data){
			//console.log(this);
			if(data){
				items = [], chuncks = [];
				for(idx = 0; idx < data.length; idx++){
					var item = {
						"OBJECTID": idx,
						"Address": data[idx][1],
						"Neighborhood": "",
						"City": data[idx][3],
						"Subregion": "",
						"Region": data[idx][4],

					};
					items.push(item);
				}
				var i,j,chunk = 1000;
				for (i=0,j=items.length; i<j; i+=chunk) {
					var group = items.slice(i,i+chunk);
					var json_chunk = format_to_json(group);
				    chuncks.push(json_chunk);
				}

console.log("Calling send");
				chunkCount = chuncks.length;
				send(chuncks, function(){
					console.log("yeah it's done");
				});
				
			}
		},
		format_to_json: function(chunck){
			converted_chunk = {};
			records = []
			for(i=0; i < chunck.length; i++){
				var chunk_item = chunck[i];
				var record = {};
				record.attributes = chunk_item;
				records.push(record);
			}
			converted_chunk.records = records;
			return converted_chunk;
		}
    };
})();

Geocode.parse_csv_file(__dirname+'/customers.csv', Geocode.submit_job);