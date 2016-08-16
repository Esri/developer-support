using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.esriSystem;

namespace ListWorkspaceReplicas
{
    public class _WorkspaceReplicas_getReplicas : ESRI.ArcGIS.Desktop.AddIns.Button
    {
        public _WorkspaceReplicas_getReplicas()
        {
        }

        protected override void OnClick()
        {
            string workspaceName = "C:\\Temp\\db@sqlserver2014.sde";
            Type factoryType = Type.GetTypeFromProgID("esriDataSourcesGDB.SdeWorkspaceFactory");
            IWorkspaceFactory workspaceFactory = ((IWorkspaceFactory)(Activator.CreateInstance(factoryType)));
            IWorkspace workspace = workspaceFactory.OpenFromFile(workspaceName, 0);

            IWorkspaceReplicas workspaceReplicas = (IWorkspaceReplicas)workspace;
            IReplica replica = null;
            int counter = 0;

            workspaceReplicas.Replicas.Reset();
            replica = workspaceReplicas.Replicas.Next();
            List<string> listOfReplicas = new List<string>();

            while (replica != null)
            {
                listOfReplicas.Add(replica.Name);
                System.Diagnostics.Debug.WriteLine("Replica no. " + counter+ " : " +listOfReplicas[counter]);
                replica = workspaceReplicas.Replicas.Next();
                counter++;
            }
	    System.Diagnostics.Debug.WriteLine("There are no more replicas associated with this workspace");
        }
    }
}   