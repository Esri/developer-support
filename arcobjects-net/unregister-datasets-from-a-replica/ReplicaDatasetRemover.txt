Attribute VB_Name = "ReplicaDatasetRemover"

''location of connection file
Public Const m_connectionfile As String = "C:\..................\Roaming\ESRI\Desktop10.2\ArcCatalog\Connection to Csc-thomas7d1.sde"
''name of the replica
Public Const m_replicaName As String = "TestReplica2"
''if to unregister all dataset (TRUE) or just unregister first (FALSE)
Public Const m_deleteAll As Boolean = False

Public Sub test1()

Dim pWKSFactory As IWorkspaceFactory
Set pWKSFactory = New SdeWorkspaceFactory

Dim pWS As IWorkspace
Set pWS = pWKSFactory.OpenFromFile(m_connectionfile, Application.hWnd)

Dim pWorkspaceReplicasAdmin3 As IWorkspaceReplicasAdmin3
Set pWorkspaceReplicasAdmin3 = pWS

Dim pWorkspaceReplicas As IWorkspaceReplicas
Set pWorkspaceReplicas = pWS

Dim pReplica As IReplica
Set pReplica = pWorkspaceReplicas.ReplicaByName(m_replicaName)



Dim pEnumReplicaDataset As IEnumReplicaDataset
Set pEnumReplicaDataset = pReplica.ReplicaDatasets
If Not pEnumReplicaDataset Is Nothing Then

    pEnumReplicaDataset.Reset
    Dim pReplicaDS As IReplicaDataset
    Set pReplicaDS = pEnumReplicaDataset.Next
    
    If m_deleteAll = True Then
        Do While Not pReplicaDS Is Nothing
            pWorkspaceReplicasAdmin3.UnregisterReplicaDataset pReplicaDS, pReplica
            Debug.Print "Unregisted : " & pReplicaDS.Name
            Set pReplicaDS = pEnumReplicaDataset.Next
        Loop
    Else
        
        If Not pReplicaDS Is Nothing Then
            pWorkspaceReplicasAdmin3.UnregisterReplicaDataset pReplicaDS, pReplica
            Debug.Print "Unregisted : " & pReplicaDS.Name
        End If
    End If
End If
End Sub
