using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.esriSystem;


namespace ArcMapAddin_DockWindowTest
{
    public class ShowDocWindowBtn : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public ShowDocWindowBtn()
        {
        }

        protected override void OnClick()
        {
            // Get Dockable window
            UID dockWinID = new UIDClass();
            dockWinID.Value = @"esri_ArcMapAddin_DockWindowTest_DockableWindow1_Class";
            IDockableWindow s_dockWindow = ArcMap.DockableWindowManager.GetDockableWindow(dockWinID);
            if (s_dockWindow.IsVisible()) // This true by default if you use the Dockable Window Add-In template to create the dockable window
                s_dockWindow.Show(false);
            else
                s_dockWindow.Show(true);

        }

        protected override void OnUpdate()
        {
        }
    }
}
