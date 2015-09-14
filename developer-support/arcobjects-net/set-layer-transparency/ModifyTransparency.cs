using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Display;
using System.Windows.Forms;

namespace HowToSetLayerTransparency_ArcMapAddin
{
    public class ModifyTransparency : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        protected override void OnClick()
        {
            if (ArcMap.Document.FocusMap.LayerCount < 1)
            {
                MessageBox.Show("You MUST have at least one layer in the map to use this tool.", "Warning",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            ILayer layer = ArcMap.Document.FocusMap.Layer[0];
            ILayerEffects layerEffects = layer as ILayerEffects;
            if (!layerEffects.SupportsTransparency) return;

            IDisplayFilterManager filterManager = layer as IDisplayFilterManager;
            filterManager.DisplayFilter = (layerEffects.Transparency == 0)
                ? new TransparencyDisplayFilterClass {Transparency = 75}
                : null;

            ArcMap.Document.ActiveView.Refresh();
        }
    }
}
