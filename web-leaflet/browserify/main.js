var L = require('leaflet')
var Esri = require('esri-leaflet')
var Geocoding = require('esri-leaflet-geocoder')

// https://github.com/Leaflet/Leaflet/issues/766
L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/images'

var map = L.map('map').setView([37.75, -122.23], 10)
Esri.basemapLayer('Topographic').addTo(map)

var searchControl = Geocoding.Controls.geosearch().addTo(map)
  
var results = L.layerGroup().addTo(map)

searchControl.on('results', function(data){
  results.clearLayers()
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng))
  }
})
