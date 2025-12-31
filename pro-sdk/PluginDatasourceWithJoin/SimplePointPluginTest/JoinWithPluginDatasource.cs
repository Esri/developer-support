using ArcGIS.Core.CIM;
using ArcGIS.Core.Data;
using ArcGIS.Core.Data.PluginDatastore;
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
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimplePointPluginTest
{
	internal class JoinWithPluginDatasource : Button
	{
		protected override void OnClick()
		{
			_ = ReadFromPluginDatasource();
			_ = JoinWithFileGeodatabaseTable();
		}

		private async Task ReadFromPluginDatasource()
		{
			try
			{
				// csvPath needs to be set to the folder containing the tree_inspections.csv file inside the \PluginDatasourceWithJoin\SimplePointPluginTest\SimplePointData\SimplePointJoinTest folder
				string csvPath = @"C:\PluginDatasourceWithJoin\SimplePointPluginTest\SimplePointData\SimplePointJoinTest";
				var dirCsv = new DirectoryInfo(csvPath);
				if (!dirCsv.Exists) throw new Exception($@"The sample cannot find and csv files in this folder: {csvPath}");
				var csvFiles = dirCsv.GetFiles();
				if (csvFiles.Length <= 0) throw new Exception($@"The test folder has no csv files: {csvPath}");
				await QueuedTask.Run(() =>
				{
					using var pluginws = new PluginDatastore(
								new PluginDatasourceConnectionPath("SimplePointPlugin_Datasource",
											new Uri(csvPath, UriKind.Absolute)));
					System.Diagnostics.Debug.Write("==========================\r\n");
					foreach (var table_name in pluginws.GetTableNames())
					{
						System.Diagnostics.Debug.Write($"Table: {table_name}\r\n");
						//open each table....use the returned table name
						//or just pass in the name of a csv file in the workspace folder
						using var table = pluginws.OpenTable(table_name);
						//Add as a layer to the active map or scene
						LayerFactory.Instance.CreateLayer<FeatureLayer>(new FeatureLayerCreationParams((FeatureClass)table), MapView.Active.Map);
					}
				});
			}
			catch (Exception ex)
			{
				MessageBox.Show(ex.Message);
			}
		}

		// Perform a join between the FileGeodatabaseTable standalone table in the Contents pane and the csv data wrapped via plugin datasource (feature layer)
		public async Task JoinWithFileGeodatabaseTable()
		{
			//Get the active map view.
			var mapView = MapView.Active;
			if (mapView == null)
				return;

			// Create join
			var input_table = "FileGeodatabaseTable";
			var input_field = "TREENAME";
			var join_table = "TREE_INSPECTIONS";
			var join_field = "TREENAME";
			var parameters = Geoprocessing.MakeValueArray(input_table, input_field, join_table, join_field);
			var gp_result = await Geoprocessing.ExecuteToolAsync("management.AddJoin", parameters);
		}
	}
}
