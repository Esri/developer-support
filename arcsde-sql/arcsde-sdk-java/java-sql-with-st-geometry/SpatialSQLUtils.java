package main;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class SpatialSQLUtils {

	public static void main(String[] args) throws SQLException {
		Connection conn = getOracleDBConnection();
		truncateTable(conn, "hazardous_sites");
		executeInsert(conn, 100);
	}
	
	private static Connection getOracleDBConnection() throws SQLException {
		Connection conn = null;
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			// odbc connection string syntax: supply the following:  
			//jdbc:oracle:oci8@//<db_server>:<oracle port>/<net_service_name>
			conn = DriverManager.getConnection("jdbc:oracle:thin:@server_name:port:SID","username","password"); 
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	private static Map<Integer, byte[]> getShapeText(Connection conn) throws SQLException{
		Map<Integer, byte[]> shpText = new HashMap<>();
		int count = 0;
		Statement stmt = null;
		String query = "SELECT sde.st_asbinary(shape) as shp FROM gis.sample_points";
		
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
	
	public static void executeInsert(Connection conn, int commit_throttle) throws SQLException{
		System.out.println("Attempting bulk insert using st_pointFromWKB");
		PreparedStatement p_stmt = null;
		int count = 0;
		String query = "INSERT INTO hazardous_sites (site_id, shape) VALUES (?, sde.st_pointFromWKB(?, 4326))";
		Map<Integer, byte[]> results = getShapeText(conn);
		
		try {
			conn.setAutoCommit(false);
			p_stmt = conn.prepareStatement(query);
			
			for (Map.Entry<Integer, byte[]> e : results.entrySet()) {
				count++;
				
				p_stmt.setInt(1, e.getKey().intValue());
				p_stmt.setBytes(2, e.getValue());
				p_stmt.executeUpdate();
				
				//commit throttle
				if((count % commit_throttle) == 0){
					System.out.println(count + " rows inserted...");
					conn.commit();
					System.out.println(count + " rows committed...");
				}
			}
			System.out.println("Inserted " + count + " rows.");
		}
		catch (SQLException ex){
			System.out.println(ex.getErrorCode() + "\n" + ex.getMessage());
		}
	}
	
	public static void truncateTable(Connection conn, String table_name){
		Statement truncateStmt = null;
		Statement countStmt = null;
		String truncateSQL = "TRUNCATE TABLE " + table_name;
		String countSQL = "SELECT COUNT(*) as count FROM " + table_name;
		
		try {
			truncateStmt = conn.createStatement();
			truncateStmt.executeQuery(truncateSQL);
			
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
