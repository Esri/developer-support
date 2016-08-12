# Using React with Leaflet (and Esri Leaflet)

> if you don't like to read, just check out the [live sample](http://esri.github.io/developer-support/web-leaflet/react/index.html).

## Prerequisites

> "Marc was almost ready to implement his "hello world" React app" - [@thomasfuchs](https://twitter.com/thomasfuchs/status/708675139253174273)

## Development Steps

1. fork/clone this github repository
2. navigate into this folder using a command prompt and run `npm install`
> this will lay down the project [dependencies](https://github.com/Esri/developer-support/blob/pages/web-leaflet/react/package.json#L8-L21) in the same folder.

3. run `npm start`
> afterward you'll be able to check out the sample application running at http://localhost:8080

## Why React?

Why not?  React must be cool.  Its an [open source project](https://facebook.github.io/react/) from Facebook developers.

## What's going on in the source?

> [index.html](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/react/index.html)

```html
<body>
  <div id="react-app"></div>
  <script src="bundle.js"></script>
</body>
```
The raw JavaScript for the app is in a file called `app.jsx`, but we reference `bundle.js` in the app's `html` because Babel is going to transpile our wild [ES6](https://babeljs.io/docs/learn-es2015/) into something the rest of the world can understand.

Webpack is used to wrap *all* of our code and **all** the external script tags into a single file.

> [app.jsx](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/react/app.jsx)

```js
import L from 'leaflet'
import esri from 'esri-leaflet'
import geocoding from 'esri-leaflet-geocoder'
```

As you can see in the snippet above, we'll need to reference Esri Leaflet classes a little differently than we do in applications that just use a [`<script>`](ahttp://esri.github.io/esri-leaflet/examples/geocoding-control.html) tag.

> [package.json](https://github.com/Esri/developer-support/blob/gh-pages/web-leaflet/react/package.json)

this is where we declare our own project as a node package and document the dependencies of the application itself:

```js
"dependencies": {
  "esri-leaflet": "^2.0.2", //npmjs.com/package/esri-leaflet
  "esri-leaflet-geocoder": "^2.1.1", // you get the idea
  "leaflet": "^1.0.0-rc.3" //npmjs.com/package/leaflet
},
```
and the packages we're using to help develop locally:
```js
"devDependencies": {
  "react": "^15.3.0",
  "react-dom": "^15.3.0",
  "standard-react": "^2.1.0",
  "webpack": "^1.13.1"
  // ...
},
```

lastly, and perhaps most importantly, the `scripts` section is where we define what happens when specific commands are called from terminal/cmd.

```js
"scripts": {
  "test": "standard-react",
  "start": "http-server & webpack --config webpack.config.js --progress --profile --colors --watch -d",
  "production": "webpack --config webpack.config.js --progress --profile --colors"
  // ...
}
```

calling `npm start` asks the popular node module [`http-server'](https://www.npmjs.com/package/http-server) to launch a tiny web server and host our files at http://localhost:8080 and recompile our built app when changes in the JavaScript are noticed. 

calling `npm run production` (only select keywords like `install` and `test` don't need to be prefaced by `run`) asks webpack to create a bundle without sourceMaps and skips launching the tiny web server.

## I want to learn more about those nifty npm commands

check out [this great article](http://www.jayway.com/2014/03/28/running-scripts-with-npm/) on running scripts with npm.  [**@andersjanmyr**](https://github.com/andersjanmyr) does a far better job explaining than i ever could.

## Credits

* this work borrows substantially from @ungoldman's [github-user-map](https://github.com/ungoldman/github-user-map/tree/gh-pages/react) (with permission)

## More resources

* [React](https://facebook.github.io/react/)
* [webpack](http://webpack.github.io/docs/)
