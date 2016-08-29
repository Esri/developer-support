# Application to use oblique imagery.

## Image service requirements:

- Image service layer requirements:
- Image service version >= 10.3.1
- Mosaic dataset using the frame camera raster type
- Sensor elevation and azimuth fields
- Mensuration capabilities activated on Image service.

## Start the app with:
```
http://[domain]/[appLocation]?configUrl=[protocol]//[configFileLocation]
```

eg: ``` 
http://myServer.com/ObliqueViewer.html?configUrl=http://myServer.com/config.json```

Config file is a .json file with the following structure:

```
{
  "imageServiceUrl": <Image service REST end point URL>,
  "mosaicMethod": <Optional Mosaic method to be used in Nadir mode>,
  "extent": <Optional JSON object of the starting extent>,
  "bookmarks": <Array of bookmarks to be showed in dropdown. Each bookmark containing id,name and extent.>
}
```

## Live Sample:

http://esri.github.io/developer-support/web-js/oblique-viewer-SingleView-app/ObliqueViewer.html?configUrl=http://esri.github.io/developer-support/web-js/oblique-viewer-SingleView-app/SampleConfig.json


## Technical notes:
- App needs to be run on a web server.
- Make sure the server hosting the config file is CORS enabled and can serve out JSON type data.
