using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Esri.FileGDB;

namespace ConsoleApp_FileGDB_API
{
    class Program
    {
        static void Main(string[] args)
        {
            //var gdbPath = ConfigurationManager.AppSettings["gdb.path"];

            var gdbPath = @"C:\temp\fgdb_test.gdb";

            Geodatabase gdb = Geodatabase.Open(gdbPath);

            var rowCollection = gdb.ExecuteSQL(@"SELECT voiceZoneName.NAME_ID,  voiceStreetAddress.NAME_ID 
                                                    FROM voiceZoneName, voiceStreetAddress 
                                                    WHERE voiceZoneName.NAME_ID = voiceStreetAddress.NAME_ID");

            foreach (var row in rowCollection)

            {
                
            }

        }
    }
}
