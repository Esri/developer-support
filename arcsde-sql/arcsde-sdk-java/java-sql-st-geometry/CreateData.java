
import java.sql.*;

public class CreateData {

	public static void createSampleTable(Connection conn, String tableName){
		Statement createStmt;
		
		String sql = "CREATE TABLE " + tableName + " (";
		sql += "objectid int, ";
		sql += "shape sde.st_geometry )";
		
		try {
			createStmt = conn.createStatement();
			createStmt.executeUpdate(sql);
			
			System.out.println( tableName + " table created!");
		}
		catch (SQLException ex){
			System.out.println(ex.getMessage());
		}	
	}
	
	public static void insertIntoTarget(Connection conn, String tableName){
		String sql = "";
		Statement insertStmt;
		
		sql += "INSERT ALL ";
		sql += "INTO " + tableName + "(objectid, shape) VALUES (1, sde.st_pointfromtext ('point (30 60)', 4326)) ";
		sql += "INTO " + tableName + "(objectid, shape) VALUES (2, sde.st_pointfromtext ('point (60 50)', 4326)) ";
		sql += "INTO " + tableName + "(objectid, shape) VALUES (3, sde.st_pointfromtext ('point (40 55)', 4326)) ";
		sql += "SELECT * FROM dual";
		try {
			insertStmt = conn.createStatement();
			insertStmt.executeUpdate(sql);
			
			System.out.println("3 rows inserted!");
		}
		catch (SQLException ex){
			System.out.println(ex.getMessage());
		}	
	}
	
	public static void checkTableExistsDrop(Connection conn, String tableName) throws SQLException{
		Statement stmt;
		DatabaseMetaData md = conn.getMetaData();
		
		System.out.println("Checking  " + tableName);
		ResultSet rs = md.getTables(null, null, tableName, null);
		if(rs.next()){
			System.out.println(tableName + " does not exist.");
		}
		else {
			String sql = "DROP TABLE " + tableName;
			Statement dropStmt = conn.createStatement();
			dropStmt.execute(sql);
			System.out.println("Dropped " + tableName);
			
		}
	}
}
