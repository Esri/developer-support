using ArcGIS.Core.CIM;
using ArcGIS.Core.Data;
using ArcGIS.Core.Geometry;
using ArcGIS.Desktop.Catalog;
using ArcGIS.Desktop.Core;
using ArcGIS.Desktop.Core.Geoprocessing;
using ArcGIS.Desktop.Editing;
using ArcGIS.Desktop.Extensions;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Dialogs;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.KnowledgeGraph;
using ArcGIS.Desktop.Layouts;
using ArcGIS.Desktop.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimplePointPluginTest
{
	internal class RemovePluginDatasource : Button
	{
		protected override void OnClick()
		{
			_ = RemovePluginDatasourceJoinAndLayer();
		}

		// Remove the join between the FileGeodatabaseTable standalone table in the Contents pane and the csv data wrapped via plugin datasource
		// using the RemoveJoin geoprocessing tool.
		// Remove TREE_INSPECTIONS layer as well
		private async Task RemovePluginDatasourceJoinAndLayer()
		{
			await QueuedTask.Run(() =>
			{
				//Get the active map view.
				var mapView = MapView.Active;
				if (mapView == null)
					return;

				var layers = MapView.Active.Map.GetLayersAsFlattenedList();
				var layerToRemove = layers.Where(x => x != null && x.Name == "TREE_INSPECTIONS").ToList();
				if (layerToRemove.Count > 0)
				{
					// Remove existing join from the FileGeodatabaseTable standalone table and then remove the layer
					var removeParameters = Geoprocessing.MakeValueArray("FileGeodatabaseTable");
					var removeJoinResult = Geoprocessing.ExecuteToolAsync("management.RemoveJoin", removeParameters);
					MapView.Active.Map.RemoveLayer(layerToRemove.First());
				}
				else { return ; }
			});
		}
	}
}
