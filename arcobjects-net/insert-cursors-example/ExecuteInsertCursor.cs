using ESRI.ArcGIS.ADF;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;

namespace HowToUseInsertCursors
{
    public class ExecuteInsertCursor : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        private static string DataPath { get { return Path.Combine(Assembly.GetExecutingAssembly().Location, "data"); } }

        protected override void OnClick()
        {
            string tablePath = Path.Combine(DataPath, @"Geodatabase\ManhattanKS.gdb\ParcelIDs");
            string tableName = Path.GetFileName(tablePath);
            const string searchField = "PID";

            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesGDB.FileGDBWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = Activator.CreateInstance(factoryType) as IWorkspaceFactory;
            IWorkspace workspace = workspaceFactory.OpenFromFile(Path.GetDirectoryName(tablePath), 0);

            IObjectClassDescription objClassDesc = new ObjectClassDescriptionClass();

            IFields fields = objClassDesc.RequiredFields;
            IFieldsEdit fieldsEdit = (IFieldsEdit) fields;

            IField field = new FieldClass();
            IFieldEdit fieldEdit = (IFieldEdit) field;

            fieldEdit.Name_2 = searchField;
            fieldEdit.Type_2 = esriFieldType.esriFieldTypeString;
            fieldEdit.IsNullable_2 = true;
            fieldEdit.AliasName_2 = searchField;
            fieldEdit.Editable_2 = true;
            fieldEdit.Length_2 = 250;

            fieldsEdit.AddField(field);
            fields = fieldsEdit;

            ITable table = CreateTable((IWorkspace2) workspace, tableName, fields);

            using (ComReleaser releaser = new ComReleaser())
            {
                ICursor cursor = table.Insert(true);
                releaser.ManageLifetime(cursor);

                string txtPath = Path.Combine(DataPath, "UniqueValues.txt");
                int searchFieldIndex = table.FindField(searchField);

                IRowBuffer buffer = table.CreateRowBuffer();

                using (StreamReader reader = new StreamReader(txtPath))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        string id = line.Split(new[] {'.', ' '}, StringSplitOptions.RemoveEmptyEntries)[1];
                        buffer.Value[searchFieldIndex] = id;
                        cursor.InsertRow(buffer);
                    }

                    cursor.Flush();
                }
            }

            ((ITableCollection) ArcMap.Document.FocusMap).AddTable(table);
            ArcMap.Document.UpdateContents();
            Marshal.FinalReleaseComObject(table);
        }

        private static ITable CreateTable(IWorkspace2 workspace, string tableName, IFields fields)
        {
            UID uid = new UIDClass {Value = "esriGeoDatabase.Object"};

            if (workspace == null) return null;

            IFeatureWorkspace featWorkspace = (IFeatureWorkspace) workspace;

            if (workspace.NameExists[esriDatasetType.esriDTTable, tableName])
            {
                using (ComReleaser releaser = new ComReleaser())
                {
                    ITable table = featWorkspace.OpenTable(tableName);
                    releaser.ManageLifetime(table);
                    ((IDataset) table).Delete();
                }
            }


            IFieldChecker fieldChecker = new FieldCheckerClass();
            IEnumFieldError enumFieldError = null;
            IFields validatedFields = null;
            fieldChecker.ValidateWorkspace = workspace as IWorkspace;
            fieldChecker.Validate(fields, out enumFieldError, out validatedFields);

            return featWorkspace.CreateTable(tableName, validatedFields, uid, null, string.Empty);
        }
    }
}
