using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geodatabase;
using System.Windows.Forms;

namespace HowToChangeLayerFieldNameAlias
{
    public class ChangeFieldAlias : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        protected override void OnClick()
        {
            if (ArcMap.Document.FocusMap.LayerCount < 1)
            {
                MessageBox.Show("");
                return;
            }

            ILayerFields layerFields = ArcMap.Document.FocusMap.Layer[0] as ILayerFields;

            for (int i = 0; i < layerFields.FieldCount; i++)
            {
                IFieldInfo fieldInfo = layerFields.FieldInfo[i];
                fieldInfo.Alias = (fieldInfo.Alias.EndsWith(" esri"))
                    ? fieldInfo.Alias.Replace(" esri", string.Empty)
                    : fieldInfo.Alias + " esri";
            }
        }
    }
}
