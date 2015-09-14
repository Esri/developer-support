using ESRI.ArcGIS.SystemUI;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Display;
using ESRI.ArcGIS.DataSourcesRasterUI;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.DataSourcesFile;
using ESRI.ArcGIS.CartoUI;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.ArcMapUI;
using ESRI.ArcGIS.ArcMap;
using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

/// How to use this sample:
/// 1. Run the sample, then turn on the drawing toolbar
/// 2. Pick the rectangle drawing tool and draw a graphic (a rectangle)
/// 3. Add this Add-In to a toolbar in ArcMap and click the button
/// 4. The graphic, which was originally yellow, will now change color to green (it will actually be added 
/// back to the screen as a green graphic element)
/// Note that Element is an Abstract class in the Carto Namespace. Its Object model diagram is under 
/// Carto Map Elements, and not under Carto Map and Page layout 

namespace ArcMapAddin
{
    public class btn : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public btn()
        {
        }

        protected override void OnClick()
        {
            try
            {
                IMxDocument mxDoc = ArcMap.Document;
                IMap map = mxDoc.FocusMap;
                IGraphicsContainer graphicsCon = map as IGraphicsContainer;
                graphicsCon.Reset();
                IElement element = graphicsCon.Next();

                IRgbColor red = new RgbColor();
                red.Blue = 0;
                red.Green = 0;
                red.Red = 255;

                IRgbColor green = new RgbColor();
                green.Blue = 0;
                green.Green = 255;
                green.Red = 0;

                ISimpleFillSymbol fillSymbol = new SimpleFillSymbolClass();
                fillSymbol.Color = green;
                fillSymbol.Outline.Color = red; // This change did not change the outline color in the display (a bug at 10.1)
                fillSymbol.Outline.Width = 3.0; // // This change did not change the outline width in the display (a bug at 10.1)

                // For assigning the symbol
                // --------------------------------------------------------------------------------

                (element as IFillShapeElement).Symbol = fillSymbol;

                // --------------------------------------------------------------------------------

                graphicsCon.DeleteAllElements();
                (graphicsCon as IActiveView).Refresh();

                graphicsCon.AddElement(element, 0);

                (graphicsCon as IActiveView).Refresh();
            }

            catch (Exception myEx)
            {
                System.Diagnostics.Debug.WriteLine(myEx.Message + " " + myEx.Source.ToString());
            }

            ArcMap.Application.CurrentTool = null;
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
