using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.ArcMapUI;
using ESRI.ArcGIS.CatalogUI;
using ESRI.ArcGIS.Catalog;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geodatabase;
using System.Windows.Forms;
using ESRI.ArcGIS.GISClient;
using ESRI.ArcGIS.esriSystem;


namespace GxDialog_Select_MapService_Layer
{
    public class GxDialog_Select_MapService_Layer : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public GxDialog_Select_MapService_Layer()
        {
        }

        protected override void OnClick()
        {
             IMxDocument pmxdoc = (IMxDocument)ArcMap.Application.Document;
             IMap pmap = pmxdoc.FocusMap;
             IGxDialog pGxDialog = new GxDialog();
             pGxDialog.Title = "Browse Data";
             //pGxDialog.set_StartingLocation("C:\\Temp");
             pGxDialog.set_StartingLocation("GIS Servers");
             IEnumGxObject pEnumGx;
             if (!pGxDialog.DoModalOpen(0, out pEnumGx))
                 return; // Exit if user press Cancel
             IGxObject pgxobject = pEnumGx.Next();
             IGxAGSObject gxAGSObject = pgxobject as IGxAGSObject;
             IAGSServerObjectName agsServerObjectName = gxAGSObject.AGSServerObjectName;
             IAGSServerConnectionName agsServerConnectionName = agsServerObjectName.AGSServerConnectionName;
             IPropertySet propertySet = agsServerConnectionName.ConnectionProperties;
             //create a new ArcGIS Server connection factory
             IAGSServerConnectionFactory2 agsServerConnectionFactory2 = (IAGSServerConnectionFactory2)new AGSServerConnectionFactory();
             IAGSServerConnection agsServerConnection = agsServerConnectionFactory2.Open(propertySet, 0);
             //get an enum of all server object names from the server (GIS services, i.e.)
             IAGSEnumServerObjectName soNames = agsServerConnection.ServerObjectNames;
             IAGSServerObjectName3 soName = (IAGSServerObjectName3)soNames.Next();
             ILayerFactory msLayerFactory = new MapServerLayerFactory();
             IEnumLayer enumLyrs = msLayerFactory.Create(soName);
             IMapServerLayer mapServerLayer = (IMapServerLayer)enumLyrs.Next();
             pmap.AddLayer((ILayer)mapServerLayer);

             ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
