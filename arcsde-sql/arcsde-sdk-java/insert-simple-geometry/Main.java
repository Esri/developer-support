package InsertShape;

import com.esri.sde.sdk.client.*;

import java.sql.*;

public class Main {
	
	private static SeConnection conn;

	public static void main(String[] args) {

		/*Direct connection to an Oracle geodatabase*/
		String server = "db_server.myorg.com", database = "", user = "sde", password = "sde@db_server/sde102";
		String instance = "sde:oracle11g";
		
		/*Direct connection to a Sql Server geodatabase
		String server = "db_server.myorg.com", database = "database_name", user = "sde", password = "sde";
		String instance = "sde:sqlserver:SERVER\\Instance";
		*/
		
		try 
		{
			System.out.println("\n\nConnecting to server ??" + server + ", instance ??" + instance);
			conn = new SeConnection(server, instance, database, user, password);
			System.out.println("Connection successful!");
		}
		catch(SeException e) 
		{
			e.printStackTrace();
			return;
		}
		
		/* Insert the sample points*/
		insertPoints("AAA_Points");
		
		/* Insert the sample lines */
		insertLines("AAA_Lines");
		
		/* Insert sample polygons*/
		insertPolygons("AAA_Poly");
		
	}

	/**
	 * Uses an array of coordinates and a quantity of line parts
	 * then inserts the line into the feature class.
	 * @param tableName
	 */
	private static void insertLines(String layerName) {
		System.out.println("\n Create Line layer and insert a line");
		try {
			//Create a layer object using the name and shape type entity
			SeLayer lineLayer = createLayer(layerName, SeLayer.SE_LINE_TYPE_MASK);
			//Set coordinate system info
			SeCoordinateReference cr = new SeCoordinateReference();
			cr.setXY(-10737418.225, -10737418.225, 100.0);
			
			//Create a shape object
			SeShape shp = new SeShape(lineLayer.getCoordRef());
			int numPts = 4;
	        int numParts = 1;
	        int[] partOffsets = new int[numParts];
	        partOffsets[0] = 0;
	        
	        SDEPoint[] ptArray = new SDEPoint[numPts];
	        ptArray[0] = new SDEPoint(100,-90);
	        ptArray[1] = new SDEPoint(200,100);
	        ptArray[2] = new SDEPoint(500,400);
	        ptArray[3] = new SDEPoint(600,800);
			
	        //Generate the geometry using the parts above
			shp.generateSimpleLine(numPts, numParts, partOffsets, ptArray);
			
			//Print out some info about the incoming geometry
			System.out.println("\n Coordinate system info:\n");
			getCoordRefDetails(cr);
			Util.getAllCoords(shp);
			
			//Insert the geometry into the feature class
			insertShape(shp, layerName);
			
		}
		catch(SeException ex) {
			ex.printStackTrace();
		}
		
	}

	/**
	 * Uses an array of coordinates and a quantity of polygon parts
	 * then inserts the line into the feature class.
	 * @param tableName
	 */
	@SuppressWarnings("deprecation")
	private static void insertPolygons(String layerName) {
		System.out.println("\n Create Polygon layer and insert a polygon");
		try {
			//Create a layer object using the name and shape type entity
			SeLayer polyLayer = createLayer(layerName, SeLayer.SE_AREA_TYPE_MASK);
			//Set coordinate system info
			SeCoordinateReference cr = new SeCoordinateReference();
			cr.setXY(-10737418.225, -10737418.225, 100.0);
			
			//Create a shape object
			SeShape shp = new SeShape(polyLayer.getCoordRef());
			int numPts = 5;
			SDEPoint[] ptArray = new SDEPoint[numPts];
			int numParts = 1;
			int[] partOffsets = new int[numParts];
			partOffsets[0] = 0;
			
			ptArray[0] = new SDEPoint(-500.0, -500.0);
			ptArray[1] = new SDEPoint( 500.0, -500.0);
			ptArray[2] = new SDEPoint( 500.0, 500.0);
			ptArray[3] = new SDEPoint(-500.0, 500.0);
			ptArray[4] = new SDEPoint(-500.0, -500.0);

			//Generate the geometry using the parts above
			shp.generatePolygon(numPts, numParts, partOffsets, ptArray);
			
			//Print out some info about the incoming geometry
			System.out.println("\n Coordinate system info:\n");
			getCoordRefDetails(cr);
			Util.getAllCoords(shp);
			
			//Insert the geometry into the feature class
			insertShape(shp, layerName);
			
		}
		catch(SeException ex) {
			ex.printStackTrace();
		}
		
	}

	/**
	 * Uses a coordinate and loop to add points at different locations
	 * while inserting the point into the feature class.
	 * @param tableName
	 */
	private static void insertPoints(String layerName) 
	{
		System.out.println("\n Create Point layer and insert points");
		
		try {
			createLayer(layerName, SeLayer.SE_POINT_TYPE_MASK);
			/* Set some spatial reference parameters*/
			SeCoordinateReference cr = new SeCoordinateReference();
			cr.setXY(-10737418.225, -10737418.225, 100.0);
			
			/* Instantiate a new shape object*/
			SeShape shp = new SeShape(cr);
			
			/* working with one point at a time*/
			int numPts = 1;
			/* X<Y coordinates of intial point*/
			double myX = 100.0;
			double myY = -100.0;
			/* static array containing a single point*/
			SDEPoint[] ptArray = new SDEPoint[1];		

            		getCoordRefDetails(cr);
            
		    /* Loop through 100 points altering their coordinates at intervals of 25*/
		    for (int i = 0; i <= 100; i++) {
				System.out.println("Inserting points...");
				ptArray[0] = new SDEPoint(myX, myY);
				shp.generatePoint(numPts, ptArray);
				
				//Insert the geometry into the feature class
				insertShape(shp, layerName);
				if(i <= 25){
					myX += 10.0;
					myY+= 10.0;
				}
				else if(i <=50){
					myX += 5.0;
					myY+= 8.0;
				}
				
				else if(i <=75){
					myX += 6.0;
					myY+= 9.0;
				}
				
				else {
					myX += 9.0;
					myY+= 7.0;
				}
				
				System.out.printf("X:Y --> %s : %s --> number: %s", myX, myY, shp.hashCode());
			}
		}
		catch(SeException e){
			e.printStackTrace();
		}
		
	}
	
	/**
	 * Creating a feature class.
	 * Check to see if the feature class exists, if it does delete it.
	 * The new feature layer created here will contain only the shape column
	 * and an objectid column.  See api docs for SeTable to create additional columns
	 * @param layerName
	 * @param shapeTypes
			SE_NIL_TYPE_MASK 
			SE_POINT_TYPE_MASK 
			SE_LINE_TYPE_MASK 
			SE_SIMPLE_LINE_TYPE_MASK 
			SE_AREA_TYPE_MASK 
			SE_MULTIPART_TYPE_MASK
	 * @return
			SeLayer
	 * @throws SeException
	 */
	public static SeLayer createLayer(String layerName, int shapeTypes) throws SeException 
	{
		/* Create the attribute table.  Spatial component is added later */
		SeTable table = new SeTable(conn, layerName);
		try 
		{
			//Delete the table if it exists.
			table.delete();
		}
		catch(SeException e)
		{
			if(SeError.SE_TABLE_NOEXIST != e.getSeError().getSdeError()){
				e.printStackTrace();
			}
		}
		
		boolean isNullable = true;
		int size = 0;
		int scale = 0;
		
		SeColumnDefinition[] colDefs = new SeColumnDefinition[1];
		colDefs[0] = new SeColumnDefinition("DESCRIPTION", SeColumnDefinition.TYPE_STRING, size, scale, isNullable);
		table.create(colDefs, "DEFAULTS");
		
		//Register the table with the geodatabase
		SeRegistration registration = new SeRegistration(conn, layerName);
		
		//Update the new layer to have an ArcSDE maintained objectid
		registration.setRowIdColumnName("OBJECTID");
		registration.setRowIdColumnType(SeRegistration.SE_REGISTRATION_ROW_ID_COLUMN_TYPE_SDE);
		registration.alter();
		
		/* Add the spatial component */
		SeLayer layer = new SeLayer(conn);
		SeCoordinateReference cr = new SeCoordinateReference();
		cr.setXY( -10737418.225, -10737418.225, 100.0);

		/* Set spatial properties*/
			layer.setCoordRef(cr);
		layer.setTableName(layerName);
		layer.setSpatialColumnName("SHAPE");
		layer.setShapeTypes(SeLayer.SE_NIL_TYPE_MASK | shapeTypes);
		layer.setGridSizes(1000.0, 0.0, 0.0);
		layer.setCreationKeyword("DEFAULTS");
		layer.create(10, 3);
		
		return layer;
		
		
	}
	
	/**
	 * Does the work of inserting the geometry into the feature class.
	 * Find this function in the api samples.
	 * @param shape
	 * @param tableName
	 * @throws SeException
	 */
 	public static void insertShape(SeShape shape, String tableName) throws SeException
	{
	
	    SeInsert insert = new SeInsert(conn);
	    String[] cols = {"SHAPE"};
	    insert.intoTable(tableName, cols);
	    insert.setWriteMode(true);
	    SeRow row = insert.getRowToSet();
	    row.setShape(0, shape);
	
	    insert.execute();
	    insert.close();
	} 

	
	/**
	 * Taken from the Util.java sample found in the api docs
	 * @param cRef
	 * @throws SeException
	 */
	@SuppressWarnings("deprecation")
	public static void getCoordRefDetails(SeCoordinateReference cRef) throws SeException
    {

        System.out.println("Description of coord system " + cRef.getCoordSysDescription());

        System.out.println("moffset : " + cRef.getFalseM() + "\t Scale factor : " + cRef.getMUnits());

        System.out.println("Measure Values --> Min: " + cRef.getMinMValue() + "\t Max: " + cRef.getMaxMValue());

        System.out.println("Projection Desc: " + cRef.getProjectionDescription());

        System.out.println("Spatial Reference Id " + cRef.getSrid().longValue());

        System.out.println("False x,y offset X: " + cRef.getFalseX() + " Y: " +
                           cRef.getFalseY() + "  Scale factor:" +
                           cRef.getXYUnits());

        System.out.println("z-offset : " + cRef.getFalseZ() +
                           "   Scale factor : " +
                           cRef.getZUnits());

        System.out.println("Z Values --> Min: " + cRef.getMinZValue() +
                           "\t Max: " +
                           cRef.getMaxZValue());

        SeExtent ext = cRef.getXYEnvelope();

        System.out.println("Coord Ref Envelope: MinX = " + ext.getMinX() +
                           " MinY = " + ext.getMinY() + " MaxX = " +
                           ext.getMaxX() +
                           " MaxY = " + ext.getMaxY() + " MinZ = " +
                           ext.getMinZ() +
                           " MaxZ = " + ext.getMaxZ());

    } // End method getCoordRefDetails

}
