import arcpy

sr = arcpy.SpatialReference(4326)  # Create a spatial reference.  In this case we are using WGS 84
coordinates = [[39.2833, -76.6167, .2, .3],[38.3658, -75.5933, .01, .01]] # The attribute information for the features we will create: [latitude, longitude, height, width]
polys = [] # Creating an empty list of polygons to append our features to.

for coord in coordinates: # Iterating through the list created above
    latitude, longitude, height, width = coord # Assigning the values from the list above

    #Creating all of the coodinate locaitons used in the creation of a polygon
    topLeftPoint = arcpy.Point(*[longitude - width,latitude + height])
    topRightPoint = arcpy.Point(*[longitude + width,latitude + height])
    bottomRightPoint = arcpy.Point(*[longitude + width,latitude - height])
    bottomLeftPoint = arcpy.Point(*[longitude - width, latitude - height])

    # Creating a new polygon object and appending it to the polys list
    newGrid = arcpy.Polygon(arcpy.Array([topLeftPoint, topRightPoint, bottomRightPoint, bottomLeftPoint, topLeftPoint]), sr)
    polys.append(newGrid)

#Copying the features from the polys list to an in memory polygon
arcpy.management.CopyFeatures(polys, "in_memory\\Polygons")
