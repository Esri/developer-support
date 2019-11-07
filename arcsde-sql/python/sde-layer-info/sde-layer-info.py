from arcpy import env
import arcpy
import datetime

class LayerDesc:
    def __init__(self, workspc, layerTable, fcName):
        self.workspc = workspc
        self.layerTable = layerTable
        self.fcName = fcName

    def getConnectionProps(self):
        workspcDesc = arcpy.Describe(self.workspc)
        cp = workspcDesc.connectionProperties
        print("Connection and Feature Class Description:")
        print("%-12s %s" % ("\tServer:", cp.server))
        print("%-12s %s" % ("\tInstance:", cp.instance))
        print("%-12s %s" % ("\tDatabase:", cp.database))

    def querySDELayer(self):
        fcDesc = arcpy.Describe(self.fcName)
        spatial_ref = fcDesc.spatialReference
        spatialIndexes = arcpy.ListIndexes(self.fcName)
        
        if spatial_ref.name == "Unknown":
            print("{0} has an unknown spatial reference".format(self.fcName))
    
        else:
            srName = spatial_ref.name
            spatRefString = spatial_ref.exportToString()
            srDomain = spatial_ref.domain.split(" ")
            srPCSCode = spatial_ref.PCSCode
            srGCSCode = spatial_ref.GCSCode
            zUnits = spatial_ref.ZFalseOriginAndUnits.split(" ")
            xyTolerance = spatial_ref.XYTolerance
            xyResolution = spatial_ref.XYResolution
            siExists = fcDesc.hasSpatialIndex
            
                    
        try:
            conn = arcpy.ArcSDESQLExecute(workspc)
            sql = "SELECT * FROM {0} WHERE table_name = '{1}'".format(self.layerTable, self.fcName)
            sde_return = conn.execute(sql)
        except:
            try:
                conn = arcpy.ArcSDESQLExecute(workspc)
                sql = "SELECT * FROM {0} WHERE table_name = '{1}'".format(self.layerTable, self.fcName)
                sde_return = conn.execute(sql)
            except:
                try:
                    conn = arcpy.ArcSDESQLExecute(workspc)
                    sqlOra = "SELECT * FROM {0} WHERE table_name = '{1}'".format(self.layerTable, self.fcName)
                    sde_return = conn.execute(sqlOra)
                except Exception as err:
                    print(sql)
                print(err)
                sde_return = False
             
        if len(str(sde_return)) > 0:
            if sde_return == True:
                print("\tNo Layer ID found")
            else:
                for val in sde_return:
                    print("\tLayer ID: {0}".format(val[0]))
                    print("\tLayer Description: {0}".format(val[1]))
                    print("\tOwner: {0}".format(val[4]))
                    print("\tShape Type: {0}".format(fcDesc.shapeType))
                    if spatial_ref.isHighPrecision == True:
                        print("\tHigh Precision: True")
                    else:
                        print("\tHigh Precision: False")
                    if val[6] != 1213464721:
                        print("\teflag value: {0}".format(str(val[6])))
                        print("\tI/O Mode: Normal")
                    else:
                        print("eflag value: {0}".format(str(val[6])))
                        print("\tI/O mode: LOAD ONLY")
                    print("Spatial Reference Properties:")
                    print("\tLayer Envelope:")
                    print("\t\tMin X: {0}\t Min Y: {1}".format(val[11], val[12]))
                    print("\t\tMax X: {0}\t Max Y: {1}".format(val[13], val[14]))
                    if siExists == True:
                        print("\tSpatial Index: Yes")
                        for index in spatialIndexes:
                            if index.name[0] == "S" or index.name[0] == 's':
                                print("\t\t " + index.name)
                    else:
                        print("\tSpatial Index: No")
                    print("\t\tGrid 1: {0}".format(val[8]))
                    print("\t\tGrid 2: {0}".format(val[9]))
                    print("\t\tGrid 3: {0}".format(val[10]))
                    
                    print("\tXY Tolerance: {0}".format(xyTolerance))
                    print("\tXY Resolution %d.5" % xyResolution)
                    print("\tXY Domain:")
                    print("\t\t" + srDomain[0] + "  " + srDomain[2])
                    print("\t\t" + srDomain[1] + "  " + srDomain[3])
                    print("\tZ Offset: {0}".format(zUnits[0]))
                    print("\tZ Units: {0}".format(zUnits[1]))
                    print("\tCoordinate System : {0}".format(srName))
                    print("\tSpatial Reference: {0}".format(spatRefString))
        
                    if srPCSCode > 0:
                        print("\t Projected Coordinate System Code: {0}".format(srPCSCode))
                    else:
                        print("\tUndefined Projected Coordinate System")
                    if srGCSCode > 0:
                        print("\tGeographic Coordinate System Code:: {0}".format(srGCSCode))
                    else:
                        print("\tUndefined Geographic Coordinate System")
                    print("\tCreation Date: " + datetime.datetime.fromtimestamp(int(val[19])).strftime('%Y-%m-%d'))
        else:
            print("Error reading layer ID")
        
        return sde_return
               
if __name__ == "__main__":   
    workspc = r"C:\Users\ken6574\Documents\ArcGIS\Projects\DataManagementProject\kgalliher(1).sde"
    env.workspace = workspc       
    test = LayerDesc(workspc, "sde.sde_layers", "PF25_Records")
    test.getConnectionProps()
    test.querySDELayer()
