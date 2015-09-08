using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.esriSystem;


namespace ArcMapAddin_DocWindow
{
    public class TurnOnOff_DocWindow : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public TurnOnOff_DocWindow()
        {
        }

        protected override void OnClick()
        {
            UID uid = new UID();
            uid.Value = ThisAddIn.IDs._DocWindowSami; // ThisAddin.IDs returns all the class IDs under this Add-in project
            IDockableWindowManager dockWindowManager = ArcMap.Application as IDockableWindowManager;
            IDockableWindow dockableWindow = dockWindowManager.GetDockableWindow(uid);
            //IDockableWindow dockableWindow = GetDockableWindow(ArcMap.Application, "esriGeoprocessingUI.GPCommandWindow"); // Open a System dockable window
            dockableWindow.Show(true); // use False to hide the dockable window
        }

        protected override void OnUpdate()
        {
        }
    }
}
