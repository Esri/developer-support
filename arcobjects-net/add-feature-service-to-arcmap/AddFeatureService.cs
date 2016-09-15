        protected override void OnClick()
        {
            IMxDocument pMx = ArcMap.Application.Document as IMxDocument;
            // This feature service contains polygons that can be rendered with ISimpleFillSymbol
            string url = "http://localhost:6080/arcgis/rest/services/FC1_Polygons/FeatureServer"; 
            IPropertySet pFeatServProp = new PropertySet();
            pFeatServProp.SetProperty("DATABASE", url);
            IWorkspaceFactory pFeatWorkspaceFact = new FeatureServiceWorkspaceFactory() as IWorkspaceFactory;
            IFeatureWorkspace pFeatureWorkspace = pFeatWorkspaceFact.Open(pFeatServProp, 0) as IFeatureWorkspace;

            IFeatureClass pfeatClass = pFeatureWorkspace.OpenFeatureClass("0") as IFeatureClass; // 0 = 1st layer in feature Service
            IFeatureLayer pfeatLayer = new FeatureLayer();
            pfeatLayer.FeatureClass = pfeatClass;
            pfeatLayer.Name = "SomeFeatureLayer";
            IGroupLayer pGroupLayer = new GroupLayer();
            pGroupLayer.Name = "SomeGroupLayer";

            // --------- RENDERER ---------------------------------------------------    
            IRgbColor rgbColor_Fill = new RgbColor();
            rgbColor_Fill.Red = 255; rgbColor_Fill.Green = 0; rgbColor_Fill.Blue = 0;

            IRgbColor rgbColor_Outline = new RgbColor();
            rgbColor_Outline.Red = 0; rgbColor_Outline.Green = 0; rgbColor_Outline.Blue = 255;

            ISimpleLineSymbol simpleLineSymbol_Outline = new SimpleLineSymbol();
            simpleLineSymbol_Outline.Color = rgbColor_Outline;
            simpleLineSymbol_Outline.Width = 3.0;

            ISimpleFillSymbol simpleFillSymbol = new SimpleFillSymbol();
            simpleFillSymbol.Style = esriSimpleFillStyle.esriSFSSolid;
            simpleFillSymbol.Color = rgbColor_Fill;
            simpleFillSymbol.Outline = simpleLineSymbol_Outline;

            ISimpleRenderer simpleRenderer = new SimpleRenderer();
            simpleRenderer.Label = "Simple Renderer";
            simpleRenderer.Symbol = simpleFillSymbol as ISymbol;
            IFeatureRenderer featureRenderer = simpleRenderer as IFeatureRenderer;

            IGeoFeatureLayer geoFeatureLayer = pfeatLayer as IGeoFeatureLayer;
            geoFeatureLayer.Renderer = featureRenderer;
            //-------  END  RENDERER ---------------------------------------------------    

            pGroupLayer.Add(pfeatLayer);
            pMx.FocusMap.AddLayer(pGroupLayer);

            ArcMap.Application.CurrentTool = null;
        }