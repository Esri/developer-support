import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

public class TestRequest {
	
	//public static String _username = "<YOUR USERNAME>";
	//public static String _usertoken = "<YOUR USERTOKEN>"; //Note this must be a user token derived from posting username and password

	public static void main(String[] args) throws Exception {
		testGet();
		//testPost();
		//testUpload();

	}

	private static void testGet() throws Exception {
		String requestURL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/MapServer/0/query";
		Map<String,Object> params = new LinkedHashMap<>();
		params.put("where", "1=1");
		params.put("returnCountOnly", "true");
		params.put("f", "json");
		Get getRequest = new Get(requestURL, params);
		String response = getRequest.execute();
		System.out.println(response);	
	}
	
	private static void testPost() throws Exception {
		String requestURL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/MapServer/0/query";
		Map<String,Object> params = new LinkedHashMap<>();
		params.put("where", "1=1");
		params.put("returnCountOnly", "true");
		params.put("f", "json");
		Post postRequest = new Post(requestURL, params);
		String response = postRequest.execute();
		System.out.println(response);	
	}
	
	private static void testUpload() throws Exception {
		String requestURL = "https://www.arcgis.com/sharing/rest/content/users/" + _username + "/addItem"; //addItem requires username in path
		final File file = new File("C:/Data/sanfran.geojson"); //Change path to fit your system.  Sample sanfran geojson included in project.
		Map<String,Object> params = new LinkedHashMap<>();
		params.put("token", _usertoken); //File uploads to ArcGIS Online require a token (create a developer account if you need too)
		params.put("title", "San Francisco");
		params.put("type", "GeoJson"); //http://resources.arcgis.com/en/help/arcgis-rest-api/#/Items_and_item_types/02r3000000ms000000/
		params.put("tags", "San Francisco");
		params.put("f", "json");
		Upload postRequest = new Upload(requestURL, params, file);
		String response = postRequest.execute();
		System.out.println(response);	
	}

}
