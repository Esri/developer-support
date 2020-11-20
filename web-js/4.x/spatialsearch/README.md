
# Spatial Search

 This sample was created to showcase the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in comparison to Mapbox. An [application](https://mychildcare.ca.gov/) created using Mapbox was provided, and I attempted to replicate some of the UI and functionality. My colleague also created an [application](https://banuelosj.github.io/nearme-route-jsapi/) to demonstrate a more map-centric solution.

The hospital data used in this project is from the U.S. Geographic Names Information System Hospitals, which is the federal standard. [The data was obtained from Esri](https://www.arcgis.com/home/item.html?id=f114757725a24d8d9ce203f61eaf8f75), and then published in May 2020. The accuracy of the data cannot be confirmed past that date. However, Hospital Locations tend to remain relatively static. Here is a description from the data source:

>U.S. Geographic Names Information System Hospitals represents the Federal standard for geographic nomenclature and contains information about the proper names and locations of physical and cultural geographic features located throughout the United States and its Territories. The U.S. Geological Survey developed the Geographic Names Information System (GNIS) for the U.S. Board on Geographic Names, a Federal inter-agency body chartered by public law to maintain uniform feature name usage throughout the Government and to promulgate standard names to the public.

  

## Using the App

The application is publicly available [here](https://spatialsearch.now.sh/). To run the web app locally, you must have [Node](https://nodejs.org/en/) installed. With Node installed, navigate to the project directory and type:
```
npm install
npm start
```

## TODO
- [ ] Add a Details componenet that appears when clicking on a List Item
- [x] Finish implementing the map feature highlighting when clicking on a List Item
- [x] Close the Menu after selecting a page

  

## Built With
*  [ArcGIS](https://developers.arcgis.com/javascript/) - Spatial Analysis/Visualization 
*  [React](https://reactjs.org/) - Frontend Framework
*  [Reactstrap](https://reactstrap.github.io/) - Bootstrap for React
*  [Vercel](https://vercel.com/) - Hosting
