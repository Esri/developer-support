using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Geodatabase;

namespace HowToUseSearchCursors
{
    public class ExecuteSearchCursor : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        private static string DataPath { get { return Path.Combine(Assembly.GetExecutingAssembly().Location, "data"); } }

        protected override void OnClick()
        {
            string featPath = Path.Combine(DataPath, @"Geodatabase\ManhattanKS.gdb\Parcels");
            string featName = Path.GetFileName(featPath);
            const string searchField = "PID";

            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesGDB.FileGDBWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = Activator.CreateInstance(factoryType) as IWorkspaceFactory;
            IFeatureWorkspace featureWorkspace = workspaceFactory.OpenFromFile(Path.GetDirectoryName(featPath), 0) as IFeatureWorkspace;

            IFeatureClass featureClass = featureWorkspace.OpenFeatureClass(featName);

            string sql = string.Format("{0} NOT IN ('', ' ', NULL)", searchField);
            IQueryFilter queryFilter = new QueryFilterClass { SubFields = searchField, IQueryFilter2_WhereClause = sql };
            ICursor cursor = (ICursor)featureClass.Search(queryFilter, true);
            int fieldIndex = cursor.FindField(searchField);

            List<string> uniqueList = new List<string>();

            IRow row;
            while ((row = cursor.NextRow()) != null)
                uniqueList.Add(row.Value[fieldIndex].ToString());
            
            uniqueList.Sort();
            string[] uniqueValues = uniqueList.Distinct().ToArray();
            string txtPath = Path.Combine(DataPath, @"UniqueValues.txt");

            using (StreamWriter writer = new StreamWriter(txtPath))
            {
                for (int i = 0; i < uniqueValues.Length; i++)
                    writer.WriteLine("{0}. {1}", i + 1, uniqueValues[i]);
            }

            Process.Start(txtPath);
            Marshal.FinalReleaseComObject(cursor);
        }
    }
}
