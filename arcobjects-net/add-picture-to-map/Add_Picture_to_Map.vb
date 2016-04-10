Public Overrides Sub OnMouseDown(ByVal Button As Integer, ByVal Shift As Integer, ByVal X As Integer, ByVal Y As Integer) 
    Dim pAV As IActiveView pAV = m_hookHelper.ActiveView 
    Dim pPoint As ESRI.ArcGIS.Geometry.IPoint = pAV.ScreenDisplay.DisplayTransformation.ToMapPoint(X, Y) 
    Dim env2 As ESRI.ArcGIS.Geometry.IEnvelope = New ESRI.ArcGIS.Geometry.Envelope 
    env2.XMax = pPoint.X + 10 
    env2.XMin = pPoint.X - 10 
    env2.YMax = pPoint.Y + 10 
    env2.YMin = pPoint.Y - 10 
    Dim pElement As IElement pElement = GetJpeg("C:\Documents and Settings\ABC.jpg ") 
    pElement.Geometry = env2 
    Dim pGraphicContainer As IGraphicsContainer 
    pGraphicContainer = m_hookHelper.FocusMap 
    pGraphicContainer.AddElement(pElement, 0) 
    pAV.Refresh() 
End Sub 

Function GetJpeg(ByVal sPath As String) As IElement 
    Dim pRasterPict As IRasterPicture 
    pRasterPict = New RasterPicture 
    Dim pOLEPict As IOlePictureElement 
    pOLEPict = New BmpPictureElement 
    pOLEPict.ImportPicture(pRasterPict.LoadPicture(sPath)) 
    GetJpeg = pOLEPict 
End Function 