using System;
using System.Collections.Generic;
using System.Text;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Schematic;
namespace EngineConsolApp_ITableWrite_Del_2
{
    class Program
    {
        private static LicenseInitializer m_AOLicenseInitializer = new EngineConsolApp_ITableWrite_Del_2.LicenseInitializer();
    
        [STAThread()]
        static void Main(string[] args)
        {
            //ESRI License Initializer generated code.
            m_AOLicenseInitializer.InitializeApplication(new esriLicenseProductCode[] { esriLicenseProductCode.esriLicenseProductCodeEngine, esriLicenseProductCode.esriLicenseProductCodeEngineGeoDB },
            new esriLicenseExtensionCode[] { });
            //ESRI License Initializer generated code.

            IWorkspaceFactory2 wsf2 = new SdeWorkspaceFactoryClass() as IWorkspaceFactory2;
            IWorkspace ws = wsf2.OpenFromFile(@"C:\Users\User123\AppData\Roaming\ESRI\Desktop10.1\ArcCatalog\ConnectionToSQLServer.sde", 0);

            IFeatureWorkspace fws = ws as IFeatureWorkspace;
            ESRI.ArcGIS.Geodatabase.IFeatureClass fc = fws.OpenFeatureClass("DB_101.DBO.Points_Projected_UTMz11NCopy4_3");

            ITableWrite tw = fc as ITableWrite;

            int numRows = 300;
            Int32[] int32Array = new Int32[numRows];

            for (Int32 i = 0; i < numRows; i++)
            {
                int32Array[i] = i;
            }

            IGeoDatabaseBridge2 gdbBridge2 = new GeoDatabaseHelperClass();

            //IGeoDatabaseBridge2 fc_gdbBridge2 = fc as IGeoDatabaseBridge2;

            bool Recycling = false;

            IFeatureCursor featCursor = gdbBridge2.GetFeatures(fc, ref int32Array, Recycling);

            ISet setOfRows = new SetClass();

            IFeature feat;
            feat = featCursor.NextFeature();

            while (feat != null)
            {
                IObject obj = feat as IObject;
                setOfRows.Add(obj);
                feat = featCursor.NextFeature();
            }
            
            // TEST 1: ITableWrite.DeleteRows
            //-------------------------------

            DateTime dateTimeNow_Start = System.DateTime.Now;
            tw.DeleteRows(setOfRows);
            DateTime dateTimeNow_End = System.DateTime.Now;
            Double timeDifference = dateTimeNow_End.Subtract(dateTimeNow_Start).Milliseconds;
            System.Diagnostics.Debug.WriteLine("ITableWrite.DeleteRows(" + numRows + "rows): Processing time = " +
                                                                            timeDifference + " Milliseconds.");

            // TEST 2: ITableWrite.RemoveRows
            //-------------------------------

            //DateTime dateTimeNow_Start = System.DateTime.Now;
            //tw.RemoveRows(setOfRows);
            //DateTime dateTimeNow_End = System.DateTime.Now;
            //Double timeDifference = dateTimeNow_End.Subtract(dateTimeNow_Start).Milliseconds;
            //System.Diagnostics.Debug.WriteLine("ITableWrite.RemoveRows(" + numRows + "rows): Processing time = " +
            //                                                                timeDifference + " Milliseconds.");

            //Do not make any call to ArcObjects after ShutDownApplication()
            m_AOLicenseInitializer.ShutdownApplication();
        }
    }
}
