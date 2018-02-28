using System;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.esriSystem;
using System.Runtime.InteropServices;
using ESRI.ArcGIS.DataSourcesGDB;
using System.IO;

namespace FGDB_Crawler_CSVGen
{
    class Program
    {
        [STAThread()]
        static void Main(string[] args)
        {
            // Don't show the "program stopped working" popup if a file/path cannot be opened
            AppDomain.CurrentDomain.UnhandledException += (sender, eargs) =>
            {
                Console.Error.WriteLine("Unhandled exception: " + eargs.ExceptionObject);
                Environment.Exit(1);
            };

            // The user must specify the root path to be explored (i.e. a path containing File GeoDatabases (*.gdb)
            // as well as an output csv file
            if (args.Length != 3)
            {
                usageExit();
            }
            else
            {
                // Bind this ArcObjects application to this machine's ArcGIS license
                ESRI.ArcGIS.RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.Desktop);
                // Fetch the License
                ESRI.ArcGIS.esriSystem.IAoInitialize ao = new ESRI.ArcGIS.esriSystem.AoInitialize();
                esriLicenseStatus status = ao.Initialize(ESRI.ArcGIS.esriSystem.esriLicenseProductCode.esriLicenseProductCodeStandard);

                string option = args[0];
                string rootPath = args[1]; // Target path is the first argument of the console application
                string outfile = args[2]; // Output CSV file is the second argument
                outfile = toCSVPath(outfile);

                switch (option)
                {
                    case "-p": // Path to a File GeoDatabase
                        testFGDBPath(rootPath);
                        Console.WriteLine("Processing... please wait.");
                        printCSVHeader(outfile);
                        exploreFGDB(rootPath, outfile);
                        break;
                    case "-P": // Path to a File GeoDatabase
                        testFGDBPath(rootPath);
                        Console.WriteLine("Processing... please wait.");
                        printCSVHeader(outfile);
                        exploreFGDB(rootPath, outfile);
                        break;
                    case "-r": // Root directory that contains File GeoDatabases
                        exploreRootDirectory(rootPath, outfile);
                        break;
                    case "-R": // Root directory that contains File GeoDatabases
                        exploreRootDirectory(rootPath, outfile);
                        break;
                    default:
                        usageExit();
                        break;
                }

                Console.WriteLine("Done Processing.");
                System.Environment.Exit(0);
            }
        }

        // If there is no '.csv' file extension, then append '.csv' to the end of the path.
        // Otherwise, return the original string
        private static string toCSVPath(string path)
        {
            string fileExt = Path.GetExtension(path); // Get this folder's file extension
            if (fileExt != ".csv") return path + ".csv";
            else return path;
        }

        private static void testFGDBPath(string path)
        {
            string fileExt = Path.GetExtension(path); // Get this folder's file extension
            if (fileExt != ".gdb")
            {
                Console.Error.WriteLine("Error: \"" + path + "\" : No .gdb extension found!");
                Console.Error.WriteLine("Aborting.");
                System.Environment.Exit(1);
            }

            if (!(Directory.Exists(path)))
            {
                Console.Error.WriteLine("Error: \"" + path + "\" : No such directory!");
                Console.Error.WriteLine("Aborting.");
                System.Environment.Exit(1);
            }
        }

        private static void exploreRootDirectory(string rootPath, string outfile)
        {
            string[] folders = null;
            try
            {
                folders = Directory.GetDirectories(rootPath);
            }
            catch (Exception exc)
            {
                Console.WriteLine("Error: Could not find the specified path: \"" + rootPath + "\"");
                Console.WriteLine(exc.InnerException.Message);
                System.Environment.Exit(1);
            }
            Console.WriteLine();
            Console.WriteLine("Processing... please wait.");
            // Print the CSV Header
            printCSVHeader(outfile);

            foreach (string folder in folders) // For each folder in the root path
            {
                try
                {
                    string fileExt = Path.GetExtension(folder); // Get this folder's file extension
                    if (fileExt != ".gdb") continue; // If the folder is not a File GeoDatabase, skip it
                    exploreFGDB(folder, outfile); // Process the File GeoDatabase
                }
                catch (Exception)
                {
                    continue;
                }

            }
        }

        private static void usageExit()
        {
            Console.Error.WriteLine("Usage: Use one of the following:");
            Console.Error.WriteLine("\t.\\FGDB-Crawler-CSVGen.exe -p path.gdb outputFile.csv");
            Console.Error.WriteLine("\t.\\FGDB-Crawler-CSVGen.exe -r targetPath outputFile.csv");
            Console.Error.WriteLine("Aborting.");
            System.Environment.Exit(1);
        }

        // Print the CSV Header to the output CSV file 'outfile'
        private static void printCSVHeader(string outfile)
        {
            string csvHeader = "Full Path,Local Path,Name,Category,Type,Full Name,Last Accessed (GMT),Time Created (GMT),Date Modified (GMT),File Size on Disk";
            csvHeader += Environment.NewLine;
            System.IO.File.WriteAllText(outfile, csvHeader);
        }


        // Append string 'str' to output CSV file 'filename'
        private static void appendToFile(string filename, string str)
        {
            using (System.IO.StreamWriter file =
                new System.IO.StreamWriter(filename, true))
            {
                file.Write(str);
                file.Flush();
                file.Close();
            }
        }

        // Explore the File GeoDatabase specified in fgdbPath, print information about its contents to the CSV file 'outfile'
        private static void exploreFGDB(string fgdbPath, string outfile)
        {
            IWorkspaceFactory workspaceFactory = (IWorkspaceFactory)Activator.CreateInstance(typeof(FileGDBWorkspaceFactoryClass));

            IFeatureWorkspace ifw = (IFeatureWorkspace)workspaceFactory.OpenFromFile(fgdbPath, 0);
            if (ifw == null) return;

            IWorkspace fw = workspaceFactory.OpenFromFile(fgdbPath, 0);

            IEnumDataset datasets = fw.Datasets[esriDatasetType.esriDTAny];

            processIEnumDataset(outfile, ifw, datasets, 0, "", fgdbPath);
        }

        // Recursively explore an IEnumDataset
        private static void processIEnumDataset(string outfile, IFeatureWorkspace ifw, IEnumDataset datasets, int depth, string localPath, string fgdbPath)
        {
            if (datasets == null) return;

            datasets.Reset();
            IDataset dataset;

            // Iterate through the entire dataset
            while (null != (dataset = datasets.Next()))
            {
                // Process the current dataset
                processIDataset(outfile, ifw, dataset, depth, localPath, fgdbPath);
            }
        }

        private static void processIDataset(string outfile, IFeatureWorkspace ifw, IDataset dataset, int depth, string localPath, string fgdbPath)
        {
            string newLocalPath = localPath + "/" + dataset.Name.ToString();

            // Print information about this dataset to the CSV
            appendToFile(outfile, fgdbPath + ",");
            appendToFile(outfile, newLocalPath + ",");
            appendToFile(outfile, dataset.Name.ToString() + ",");
            appendToFile(outfile, dataset.Category.ToString() + ",");
            appendToFile(outfile, dataset.Type.ToString() + ",");
            appendToFile(outfile, dataset.FullName.ToString() + ",");

            printIDatasetSizeAndTime(outfile, ifw, dataset.Name.ToString(), depth);

            // If this dataset has children, iterate through its children
            IEnumDataset children = dataset.Subsets;
            processIEnumDataset(outfile, ifw, children, depth + 1, newLocalPath, fgdbPath);
        }

        // Print the IDataset's size and time. If it doesn't have any, print a message and then return
        private static void printIDatasetSizeAndTime(string outfile, IFeatureWorkspace ifw, string name, int depth)
        {

            try
            {
                var pTable = ifw.OpenTable(name);
                if (pTable == null) return;

                var pDFS = (IDatasetFileStat)pTable;
                if (pDFS == null) return;

                // Date Modified
                var unixtimestmap = pDFS.StatTime[esriDatasetFileStatTimeMode.esriDatasetFileStatTimeLastModification];
                appendToFile(outfile, unixTimeStampToString(unixtimestmap) + ",");

                // Time Created
                unixtimestmap = pDFS.StatTime[esriDatasetFileStatTimeMode.esriDatasetFileStatTimeCreation];
                appendToFile(outfile, unixTimeStampToString(unixtimestmap) + ",");

                // Last Accessed
                unixtimestmap = pDFS.StatTime[esriDatasetFileStatTimeMode.esriDatasetFileStatTimeLastAccess];
                appendToFile(outfile, unixTimeStampToString(unixtimestmap) + ",");

                // File Size on Disk
                string sizeBytes = pDFS.StatSize.ToString();
                appendToFile(outfile, convertBytes(sizeBytes) + Environment.NewLine);
            }
            catch (COMException e)
            {
                // Can't open table ; can't get info about date modified / time created / last accessed / file size on disk
                // so fields will be left blank in the CSV
                appendToFile(outfile, ",,," + Environment.NewLine);
                return;
            }
        }
        
        // Convert a Unix timestaop to a readable string
        private static string unixTimeStampToString(int timestamp)
        {
            DateTime dt = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            DateTime dtResult = dt.AddSeconds(Convert.ToDouble(timestamp));
            return dtResult.ToString();
        }

        // Given a number of bytes, return a readable string to 2 decimal places
        private static string convertBytes(string numBytes)
        {
            double bytes = double.Parse(numBytes);

            string result;

            if (bytes >= 1099511627776)
            {
                double terabytes = bytes / 1099511627776;
                result = Math.Round(Convert.ToDecimal(terabytes), 2).ToString() + " TB";
            }
            else if (bytes >= 1073741824)
            {
                double gigabytes = bytes / 1073741824;
                result = Math.Round(Convert.ToDecimal(gigabytes), 2).ToString() + " GB";
            }
            else if (bytes >= 1048576)
            {
                double megabytes = bytes / 1048576;
                result = Math.Round(Convert.ToDecimal(megabytes), 2).ToString() + " MB";
            }
            else if (bytes >= 1024)
            {
                double kilobytes = bytes / 1024;
                result = Math.Round(Convert.ToDecimal(kilobytes), 2).ToString() + " KB";
            }
            else
            {
                result = Math.Round(Convert.ToDecimal(bytes), 2).ToString() + " bytes";
            }
            return result;
        }
    }
}
