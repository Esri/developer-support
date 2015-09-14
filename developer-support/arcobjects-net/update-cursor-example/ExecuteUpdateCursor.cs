using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Geodatabase;

namespace HowToUseUpdateCursors
{
    public class ExecuteUpdateCursor : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        private static string DataPath { get { return Path.Combine(Assembly.GetExecutingAssembly().Location, "data"); } }

        protected override void OnClick()
        {
            string tablePath = Path.Combine(DataPath, @"Geodatabase\ManhattanKS.gdb\ParcelIDs");
            string tableName = Path.GetFileName(tablePath);
            const string updateField = "PID";

            // open the table
            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesGDB.FileGDBWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = Activator.CreateInstance(factoryType) as IWorkspaceFactory;
            IFeatureWorkspace featureWorkspace = workspaceFactory.OpenFromFile(Path.GetDirectoryName(tablePath), 0) as IFeatureWorkspace;
            ITable table = featureWorkspace.OpenTable(tableName);

            IQueryFilter queryFilter = new QueryFilterClass {SubFields = updateField};

            ICursor cursor = table.Update(queryFilter, false);

            int updateFieldIndex = table.FindField(updateField);

            IRow row;
            int i = 0;
            while ((row = cursor.NextRow()) != null)
            {
                int task = i%2;
                switch (task)
                {
                    case 0:
                        row.Delete();
                        break;
                    case 1:
                        row.Value[updateFieldIndex] = "0:" + row.Value[updateFieldIndex];
                        break;
                }

                cursor.UpdateRow(row);
                i += 1;
            }
        }
        protected override void OnUpdate()
        {
            Enabled = ArcMap.Application != null;
        }
    }

}
