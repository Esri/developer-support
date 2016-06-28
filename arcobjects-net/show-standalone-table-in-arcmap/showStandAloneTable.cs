protected override void OnClick()
{           
     IMap map = ArcMap.Document.FocusMap;
     IStandaloneTableCollection standAloneTableCollection = map as IStandaloneTableCollection;
     ITable table2 = null;
     for (int i = 0; i < standAloneTableCollection.StandaloneTableCount; i++)
     {
         if (standAloneTableCollection.StandaloneTable[i].Name == "TestStandAloneTable")
             table2 = standAloneTableCollection.StandaloneTable[i] as ITable;
     }
     ITableWindow pTableWindow = new TableWindowClass();
     pTableWindow.Table = table2;
     int fieldIndex = table2.FindField("OBJECTID");
     pTableWindow.Application = ArcMap.Application;
     pTableWindow.Show(true);
}
