using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.ArcMapUI;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Display;

namespace SetSelectionSymbol
{
    public class SetSelectSym : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public SetSelectSym()
        {
        }

        protected override void OnClick()
        {
            IMxDocument pMxDoc = ArcMap.Application.Document as IMxDocument;
            IMap pMap = pMxDoc.FocusMap;
            IFeatureLayer pFeatLayer = pMap.Layer[0] as IFeatureLayer;
            IFeatureSelection featSel = pFeatLayer as IFeatureSelection;
            ISimpleFillSymbol polySym = new SimpleFillSymbol();
            IRgbColor pColor = new RgbColor();
            pColor.Red = 0;
            pColor.Green = 250;
            pColor.Blue = 0;
            IRgbColor pOutColor = new RgbColor();
            pOutColor.Red = 0;
            pOutColor.Green = 0;
            pOutColor.Blue = 250;
            ILineSymbol pLineSym = new SimpleLineSymbol();
            pLineSym.Color = pOutColor;
            pLineSym.Width = 2;
            polySym.Color = pColor;
            polySym.Outline = pLineSym;
            featSel.SetSelectionSymbol = true;
            featSel.SelectionSymbol = polySym as ISymbol;
            //
            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
