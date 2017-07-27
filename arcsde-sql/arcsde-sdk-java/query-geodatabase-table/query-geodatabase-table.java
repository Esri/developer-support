import com.esri.sde.sdk.client.SeColumnDefinition;
import com.esri.sde.sdk.client.SeConnection;
import com.esri.sde.sdk.client.SeException;
import com.esri.sde.sdk.client.SeQuery;
import com.esri.sde.sdk.client.SeRow;
import com.esri.sde.sdk.client.SeSqlConstruct;
import com.esri.sde.sdk.client.SeTable;

public class Main {

	SeConnection conn = null;
	public static void main(String[] args) throws SeException {
		try{
			//Connect to a geodatabase with a direct connection:
			SeConnection conn = new SeConnection("dbserver", "sde:oracle11g:", "", "username", "password@dbserver/sid");
			System.out.println("Connected");
		
			// Instantiate an SeTable object from an existing feature class:
			String srcTableName = "sample_points".toUpperCase();
			SeTable srcTable = new SeTable(conn, srcTableName);
			
			// Get the feature class' columns
			SeColumnDefinition[] colDefs = srcTable.describe();
			int numColumns = colDefs.length;
			String[] cols = new String[numColumns];
			
			//Print all the column names to the console:
			System.out.println("Print all the column names:");
			for (int i = 0; i < cols.length; i++) {
				cols[i] = colDefs[i].getName();
				System.out.println(colDefs[i].getName());
			}
			
			//Query the SeTable object and print the objectid values:
			SeSqlConstruct sqlCons = new SeSqlConstruct(srcTableName);
			SeQuery query = new SeQuery(conn, cols, sqlCons);
			query.prepareQuery();
			query.execute();
			SeRow row = query.fetch();
			while(row != null){
				System.out.println("ObjectID: " + row.getInteger(0));
				row = query.fetch();
			}
		}
		
		catch(SeException ex){
			System.out.println(ex.getMessage());
		}
	}
}