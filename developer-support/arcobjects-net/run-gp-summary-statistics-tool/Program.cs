using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRI.ArcGIS.Geoprocessing;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS;
namespace Console_GPSummaryStatistics
{
    class Program
    {
        /// <summary>
        /// Sample code for running Geoprocessing summary statistics tool.
        /// </summary>
        private IGeoProcessorResult2 gpr = null;
        static void Main(string[] args)
        {
            RuntimeManager.Bind(ProductCode.Desktop);
            GeoProcessor gp =new  GeoProcessor();
            IVariantArray parameters = new VarArrayClass();
               
            //input layer location
            parameters.Add(@"C:\junk\122.mdb\test");
            //output location
            parameters.Add(@"C:\\Users\\shri7493\\Documents\\ArcGIS\\Default.gdb\\TBL_HYDRANT_Statistics");
            //summary field followed by summary method - in this case "MAX" - maximium value
            parameters.Add("OBJECTID MAX");

            IGeoProcessorResult gpResult = gp.Execute("Statistics_analysis", parameters, null);
            for (int i = 0; i < gpResult.MessageCount; i++)
            {
            Console.Write (gpResult.GetMessage(i).ToString());
            }


            gp.ClearMessages();
        }
    }
}
