using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ESRI.ArcGIS;
using ESRI.ArcGIS.esriSystem;


namespace ConsoleApplication_ESLF_License
{
    class Program
    {
        static void Main(string[] args)
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ProductCode.Engine);

            // 1. Authorize the ESLF license
            ESRI.ArcGIS.esriSystem.IAuthorizeLicense aoAuthorizeLicense = new AoAuthorizeLicenseClass();

            try
            {
                string pathToLicenseFile = @"C:\temp\EngineTest.Eslf";
                string password = "";

                aoAuthorizeLicense.AuthorizeASRFromFile(pathToLicenseFile, password);

                string featuresAdded = aoAuthorizeLicense.FeaturesAdded;
                System.Diagnostics.Debug.WriteLine("Features Added: " + featuresAdded);
		
		// 2. De-Authorize ESLF License
                aoAuthorizeLicense.DeauthorizeASRFromFile(pathToLicenseFile, password);

                featuresAdded = aoAuthorizeLicense.FeaturesAdded;
                System.Diagnostics.Debug.WriteLine("Features Added: " + featuresAdded);
            }
            catch (Exception e)
            {
                string lastError;
                int errorNumber = aoAuthorizeLicense.get_LastError(out lastError);
                System.Diagnostics.Debug.WriteLine("Error Number " + errorNumber + " : " + e.Message + ". Last Error: " + lastError);
            }

           

            // Check if the Engine Product Code is available
            ESRI.ArcGIS.esriSystem.IAoInitialize aoInitialize = new AoInitialize();
            ESRI.ArcGIS.esriSystem.esriLicenseStatus esriLicense_Status = aoInitialize.IsProductCodeAvailable(esriLicenseProductCode.esriLicenseProductCodeEngine);
            System.Diagnostics.Debug.WriteLine("esriLicenseStatus: " + esriLicense_Status);

        }
    }
}
