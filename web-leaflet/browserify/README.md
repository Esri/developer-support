# Using Browserify with Leaflet (and Esri Leaflet)

> if you don't like to read, just check out the [live sample](http://esri.github.io/developer-support/web-leaflet/browserify/index.html).

## Prerequisites

install [Node.js](https://nodejs.org/en/)/npm.

## Development Steps

1. fork/clone this github repository
2. navigate into this folder using a command prompt and run `npm install`
> this will lay down the project [dependencies](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/browserify/package.json#L8-L18) in the same folder.

3. run `npm start`
> afterward you'll be able to check out the sample application running at http://localhost:1337

4. run `npm run compile` to build a new local copy of the source after you make your own changes.

## Why browserify?

[npm](http://npmjs.org) is an amazing package manager.  [browserify](http://browserify.org/) helps us leverage it to organize and bundle the dependencies of browser based applications too!

one really cool benefit is that you can include one `<script>` tag in your application to load all your own JavaScript and **all** your external dependencies.

```html
<script src="./bundle.js"></script>
```
instead of
```html
<script src="//cdn.jsdelivr.net/leaflet/0.7.3/leaflet.js"></script>
<!--which has to be fetched successfully before-->
<script src="//cdn.jsdelivr.net/leaflet.esri/1.0.0/esri-leaflet.js"></script>
<!--and so on-->
<script src="//cdn.jsdelivr.net/leaflet.esri.geocoder/1.0.2/esri-leaflet-geocoder.js"></script>
<!--and so on-->
<script src=".lib/main.js"></script>
```

## What's going on in the source?

basically, all we've done is reorganized [this previously published sample](http://esri.github.io/esri-leaflet/examples/geocoding-control.html) into a couple different files.

> [index.html](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/browserify/index.html)

```html
<body>
  <div id="map"></div>
  <script src="./bundle.js"></script>
</body>
```
even though the raw source for the app itself is in a file called `main.js`, we only reference `bundle.js` in the app's `html`.

this is because browserify is going to wrap *all* of our code and **all** the external script tags into a single file.

> [main.js](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/browserify/main.js)

```js
var L = require('leaflet')
var Esri = require('esri-leaflet')
var Geocoding = require('esri-leaflet-geocoder')
```

`main.js` is more or less composed of the same code we find [here](http://esri.github.io/esri-leaflet/examples/geocoding-control.html), with the addition of calling `require()` to reference the external dependencies.

the lines above only resolve because our own project's `package.json` mentions the [same node packages](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/browserify/package.json#L9-L11) and we've made sure they are present locally by calling `npm install`.

> [package.json](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/browserify/package.json)

this is where we declare our own project as a node package and document the dependencies of the application itself:

```js
"dependencies": {
  "esri-leaflet": "^1.0.0", //npmjs.com/package/esri-leaflet
  "esri-leaflet-geocoder": "^1.0.2", // you get the idea
  "leaflet": "^0.7.3" //npmjs.com/package/leaflet
},
```
and the packages we're using to help develop locally:
```js
"devDependencies": {
  "browserify": "^11.0.1", // command line tool we use for bundling
  "http-server": "^0.8.0", // for running the sample over 'http'
  // ...
},
```

lastly, and perhaps most importantly, the `scripts` section is where we define what happens when specific commands are called from terminal/cmd.

```js
"scripts": {
  "start": "http-server -p 1337",
  "compile": "browserify main.js -o bundle.js",
  // ...
}
```

calling `npm start` asks the popular node module [`http-server'](https://www.npmjs.com/package/http-server) to launch a tiny web server and host our files at http://localhost:1337

calling `npm run compile` (only select keywords like `install` and `test` don't need to be prefaced by `run`) asks browserify to create the bundled javascript file we're actually referencing in our app.

## I want to learn more about those nifty npm commands

check out [this great article](http://www.jayway.com/2014/03/28/running-scripts-with-npm/) on running scripts with npm.  [**@andersjanmyr**](https://github.com/andersjanmyr) does a far better job explaining than i ever could.

## More resources

* [getting started with browserify](http://www.sitepoint.com/getting-started-browserify/)
* [npm cheatsheet](http://browsenpm.org/help)
* [maps with leaflet.js & browserify](http://makerlog.org/posts/leaflet-basics/)

#### Extra credit (pull requests welcomed)

* find/use the npm script for creating a minified, uglified, gzipped build (weighing in at `51kb` instead of `292kb`).
* learn how to use [`watchify`](https://github.com/substack/watchify) and avoid having to manually recompile the source each time you make an update to the source code.
* make the sample do something more *interesting* :trollface:
