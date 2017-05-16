import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class STDMLUtils {

	public static void main(String[] args) throws SQLException {
		Connection conn = getOracleDBConnection("dbserver", "sde1041", "gis", "gis");
		
		//Create some sample data
		String targetTable = "target_points";
		String destinationTable = "destination_points";
		
		CreateData.checkTableExistsDrop(conn, targetTable);
		CreateData.checkTableExistsDrop(conn, destinationTable);
		
		CreateData.createSampleTable(conn,  targetTable);
		CreateData.createSampleTable(conn, destinationTable);
		
		//Insert some points into the target table.
		CreateData.insertIntoTarget(conn, targetTable);
		
		//truncate any existing records from the target table
		truncateTable(conn, destinationTable);
		
		//Grab records from the target table and insert them into the destination table.
		executeInsert(conn, targetTable, destinationTable);
		
		//verify the destination table has records
		verifyInsert(conn, destinationTable);
	}

	private static Connection getOracleDBConnection(String server, String database, String username, String password) throws SQLException {
		Connection conn = null;
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			conn = DriverManager.getConnection("jdbc:oracle:thin:@" + server + ":1521:" + database, username, password); 
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	/* Uses ST_AsBinary to get the binary representation of a geometry.
	 * http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-asbinary.htm
	 * */
	private static Map<Integer, byte[]> getShapeText(Connection conn, String tableName) throws SQLException{
		Map<Integer, byte[]> shpText = new HashMap<>();
		int count = 0;
		Statement stmt = null;
		String query = "SELECT sde.st_asbinary(shape) as shp FROM " + tableName;
		
		try{
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while(rs.next()){
				count++;
				//String shp = rs.getString("shp");
				byte[] shp = rs.getBytes("shp");
				shpText.put(count, shp);
			}
		}
		catch (SQLException ex){
			System.out.println(ex.getMessage());
		}
		finally {
	        if (stmt != null) { stmt.close(); }
	    }
		return shpText;
	}
	
	/* Uses ST_PointFromWKB to create a new geometry for insert.
	 * http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-pointfromwkb.htm
	 * */
	public static void executeInsert(Connection conn, String targetTable, String destinationTable) throws SQLException{
		System.out.println("Attempting bulk insert using st_pointFromWKB");
		
		PreparedStatement p_stmt = null;
		int count = 0;
		String query = "INSERT INTO " + destinationTable + " (objectid, shape) VALUES (?, sde.st_pointFromWKB(?, 2230))";
		Map<Integer, byte[]> results = getShapeText(conn, targetTable);
		
		try {
			conn.setAutoCommit(true);
			p_stmt = conn.prepareStatement(query);
			
			for (Map.Entry<Integer, byte[]> e : results.entrySet()) {
				count++;
				p_stmt.setInt(1, e.getKey().intValue());
				p_stmt.setBytes(2, e.getValue());
				p_stmt.executeUpdate();
			}
			System.out.println("Inserted " + count + " rows.");
		}
		catch (SQLException ex){
			System.out.println(ex.getErrorCode() + "\n" + ex.getMessage());
		}
	}
	
	/* Uses ST_AsText to select the string representation of a geometry.
	 * http://desktop.arcgis.com/en/arcmap/10.3/manage-data/using-sql-with-gdbs/st-astext.htm
	 * */
	private static void verifyInsert(Connection conn, String destinationTable) throws SQLException {
		Statement stmt = null;
		String sql = "SELECT objectid, sde.ST_AsText(shape) as shp FROM " + destinationTable;
		
		try {
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()){
				int oid = rs.getInt("OBJECTID");
				String shape = rs.getString("shp");
				System.out.println("\tObjectid: " + oid + " Shape: " + shape);
			}
		}
		catch (SQLException e ) {
	        System.out.println(e.getMessage());
	    } finally {
	        if (stmt != null) { stmt.close(); }
	    }	
	}
	
	public static void truncateTable(Connection conn, String table_name){
		Statement truncateStmt = null;
		Statement countStmt = null;
		String truncateSQL = "TRUNCATE TABLE " + table_name;
		String countSQL = "SELECT COUNT(*) as count FROM " + table_name;
		
		try {
			truncateStmt = conn.createStatement();
			truncateStmt.executeUpdate(truncateSQL);
			
			countStmt = conn.createStatement();
			ResultSet rs = countStmt.executeQuery(countSQL);
			System.out.println("Truncated " + table_name);
			while(rs.next()){
				System.out.println(rs.getInt("count") + " rows");
			}
		}
		catch (SQLException ex){
			System.out.println(ex.getMessage());
		}	
	}
}
