# Using Esri Cedar Graphics 
## About this example

There are two examples of 3D maps where we can see the USA population represented by struded symbols. By clicking on any graphic bar/pie we can go to the selected state:

* [Using horizontal bars graphics](http://jimeno0.github.io/3DEsriMaps/3DmapCedarBars.html)
* [Using pie chart graphics](http://jimeno0.github.io/3DEsriMaps/3DmapCedarPie.html).

## How this Cedar example works

I learn how to do it form the [Esri Cedar tutorial](http://esri.github.io/cedar/tutorial/). There are many simple examples if you want to learn how to start with Cedar.

### Adding the libraries

First add the libraries

```html
<script type="text/javascript" src="//esri.github.io/cedar/js/d3.min.js"></script>
<script type="text/javascript" src="//esri.github.io/cedar/js/vega.js"></script>
<script type="text/javascript" src="//esri.github.io/cedar/js/cedar.js"></script>
```
### Chart

Create the Cedar Chart by using `new Cedar`constructor.
I define a couple of variables to be able to use the same graphics scaffold to many others services by just changing these variables. These variables are:

* **Service url** : Feature/Map service url
* **Fields to display** :
	What field we want to display on each axe
	* `y` field
	* `x` field(In case we use Pie Graphics instead of use `x` field we will have a propertie named `label`)
* **Tooltip**:
	* `tooltipTitle`
	* `tooltipContent`

```js
var usaStatesUrl = 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3';

var xField = "STATE_NAME",
yField = "POP2000",
toolTipTitle = "{STATE_NAME}",
toolTipContent = "{POP2000}";
```
Of course there is no need to do this but I found it helpful to me.

Then I create a **new Cedar** chart wich has the following properties:

* `type`: Type of graphic, in this case I use Pie Graphics but there are many  other types that you can see in the [Esri Cedar tutorial](http://esri.github.io/cedar/tutorial/)

* `dataset`: Where we define the service `url` and the `mappings` settings. Here is where we set wich service fields to display in the Graphic, how we want to `sort` the results, the Pie `radius` and others

```js
var chart = new Cedar({
  "type": "pie",
  "dataset": {
    "url":usaStatesUrl,
    "mappings":{
      "label": {"field":xField,"label":"States"},
      "y": {"field":yField,"label":"Population"},
      "sort": yField,
      "radius": 270
    }
  }
});
```
### Tooltip

Here I set the tooltip title and content template

```js
chart.tooltip = {
  "title": toolTipTitle,
  "content": "Population: " + toolTipContent
};
```
### Show

Set where we show the graphic, `width` and `height`

```js
chart.show({
  elementId: "#cedarDiv",
  width: 550,
  height: 550,
  autolabels: true
});
```
### On click event

By clicking on any bar/pie trigger the defined function:
In this case I create a `clickBar`function that checks wich state is the selected then highlight and go to it

```js
chart.on('click', clickBar);
```


