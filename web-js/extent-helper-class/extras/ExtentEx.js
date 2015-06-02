/**
 *
 */
define(
    ["dojo/_base/declare", "dojo/_base/lang", "esri/geometry/Extent",
        "esri/geometry/Point","esri/SpatialReference"
    ], function(declare, lang, Extent, Point, SpatialReference) {
        return declare(null, {
        		centroid:null,
        		midpointTop:null,
        		midpointBottom:null,
        		midpointLeft:null,
        		midpointRight:null,
        		lowerLeft:null,
        		upperLeft:null,
        		lowerRight:null,
        		upperRight: null,
        		extent:null,
        		wkid:null,
        		
        		constructor: function(extent) {
                console.log("constructed");
            		this.extent = extent;
	            	this.centroid = this.getCenterOfExtent();
	    			this.midpointTop = this.getMidpointTop();
	    			this.midpointBottom = this.getMidpointBottom();
	    			this.midpointLeft = this.getMidpointLeft();
	    			this.midpointRight = this.getMidpointRight();
	    			this.lowerLeft = this.getLowerLeft();
	    			this.upperLeft = this.getUpperLeft();
	    			this.lowerRight = this.getLowerRight();
	    			this.upperRight = this.getUpperRight();
	    			if (extent.spatialReference !== undefined) {
	    				this.wkid = extent.spatialReference.wkid;
	    			}else{
	    				throw "Extent Object Has Invalid Spatial Reference."
	    			}
	    			
            },
            getCenterOfExtent:function(){
	            	var x = (this.extent.xmax - (this.extent.xmax - this.extent.xmin) / 2);
	    			var y = (this.extent.ymax - (this.extent.ymax - this.extent.ymin) / 2);
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getMidpointTop:function(){
	    			var x = (this.extent.xmax - (this.extent.xmax - this.extent.xmin) / 2);
	    			var y = this.extent.ymax;
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getMidpointBottom:function(){
	    			var x = (this.extent.xmax - (this.extent.xmax - this.extent.xmin) / 2);
	    			var y = this.extent.ymin;
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getMidpointLeft: function(){
	    			var x = this.extent.xmax - (this.extent.xmax - this.extent.xmin);
	    			var y = (this.extent.ymax - (this.extent.ymax - this.extent.ymin) / 2);
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getMidpointRight: function(){
	    			var x = this.extent.xmax;
	    			var y = (this.extent.ymax - (this.extent.ymax - this.extent.ymin) / 2);
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getLowerLeft: function(){
	    			var x = this.extent.xmin;
	    			var y = this.extent.ymin;
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getUpperLeft: function(){
	    			var x = this.extent.xmin;
	    			var y = this.extent.ymax;
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getLowerRight: function(){
	    			var x = this.extent.xmax;
	    			var y = this.extent.ymin;
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getUpperRight: function(){
	    			var x = this.extent.xmax;
	    			var y = this.extent.ymax;
	    			var point = new Point(x, y, new SpatialReference({ wkid: this.wkid }));
	    			return point;
            },
            getTopLeftQuadrant:function(){
            		var tl = this.createExtentEnvelope(this.midpointLeft,this.midpointTop);
            		return tl;
            },
            getTopRightQuadrant:function(){
	            	var tr = this.createExtentEnvelope(this.centroid,this.upperRight);
	    			return tr;
            },
            getBottomLeftQuadrant:function(){
	            	var bl = this.createExtentEnvelope(this.lowerLeft,this.centroid);
	    			return bl;
            },
            getBottomRightQuadrant:function(){
	            	var br = this.createExtentEnvelope(this.midpointBottom,this.midpointRight);
	    			return br;
            },
            getQuardrants:function(){
	            	return {
	            		"topLeft": this.getTopLeftQuadrant(),
	            		"topRight": this.getTopRightQuadrant(),
	            		"bottomLeft": this.getBottomLeftQuadrant(),
	            		"bottomRight": this.getBottomRightQuadrant()
	            	}
            },
            createExtentEnvelope:function(lowerLeft,upperRight){
	            	var extent = new Extent({"xmin":lowerLeft.x,"ymin":lowerLeft.y,"xmax":upperRight.x,"ymax":upperRight.y,"spatialReference":{"wkid":this.wkid}});	
	    			return extent;
            }
            
        });
    });