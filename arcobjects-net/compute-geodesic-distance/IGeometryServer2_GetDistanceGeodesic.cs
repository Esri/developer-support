// C# code Snippet on how to use IGeometryServer2.GetDistanceGeodesic
// =====================================================================

IGeometryServer2 IGeomServ2 = new GeometryServerClass();
ISpatialReferenceFactory2 sRF = new SpatialReferenceEnvironmentClass();
IGeographicCoordinateSystem pSR = sRF.CreateGeographicCoordinateSystem((int)esriSRGeoCSType.esriSRGeoCS_NAD1983);
IUnit pIUnit = sRF.CreateUnit((int)(esriSRUnit2Type.esriSRUnit_SurveyYard));
ILinearUnit pLUnit = pIUnit as ILinearUnit;
m_SegLength = 0;
for (j = 1; j <= nPointsCount1 - 1; j++)
{

   IGeometry Pobj1 = Pts1.get_Point(j-1);

   IGeometry Pobj2 = Pts1.get_Point(j);

   m_SegLength = m_SegLength + IGeomServ2.GetDistanceGeodesic(pSR, Pobj1, Pobj2, pLUnit);
}
m_SegLength = m_SegLength * 3; //Convert Yards to feet
MessageBox.Show(Convert.ToString(m_SegLength));
