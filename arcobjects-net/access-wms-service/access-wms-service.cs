using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.GISClient;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.ArcMapUI;
using System.Windows.Forms;
namespace WMSInteraction
{
    public class WMSInteraction : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public WMSInteraction()
        {
        }

        protected override void OnClick()
        {
            IMxDocument mxDoc = (IMxDocument)ArcMap.Application.Document;
            IWMSGroupLayer wmsMapLayer = new WMSMapLayerClass();
            IWMSConnectionName connName = new WMSConnectionNameClass();

            IPropertySet propSet = new PropertySetClass();
            propSet.SetProperty("URL", "https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer");
            connName.ConnectionProperties = propSet;

            //Put the WMS service layers in a DataLayer
            IDataLayer dataLayer = (IDataLayer)wmsMapLayer;
            dataLayer.Connect((IName)connName);

            // Get access to WMS service and layer propeties
            IWMSServiceDescription serviceDesc = wmsMapLayer.WMSServiceDescription;
            IWMSLayerDescription groupDesc = serviceDesc.LayerDescription[0];

            //Clear existing WMS service group layer.
            wmsMapLayer.Clear();

            //Create an empty layer and populate it with the desired sub layer index.
            ILayer newLayer;
            IWMSLayer newWMSLayer = wmsMapLayer.CreateWMSLayer(groupDesc.LayerDescription[1]);
            newLayer = (ILayer)newWMSLayer;
            wmsMapLayer.InsertLayer(newLayer, 0);
            
            //Add the layer to the map.
            mxDoc.FocusMap.AddLayer((ILayer)wmsMapLayer);
            IActiveView activeView = (IActiveView)mxDoc.FocusMap;
            activeView.Refresh();

            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}