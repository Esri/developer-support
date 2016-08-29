import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

public class Post {
	
	public String _requestURL;
	public Map<String,Object> _params;
	
	public Post(String requestURL, Map<String,Object> params){
		if(params == null || requestURL == null){
			return;
		}
		this._params = params;
		this._requestURL = requestURL;
	}
	
	public String execute() throws IOException{
		
		StringBuilder postData = new StringBuilder();
        
		for (Map.Entry<String,Object> param : this._params.entrySet()) {
            if (postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        
		byte[] postDataBytes = postData.toString().getBytes("UTF-8");
		int    postDataLength = postDataBytes.length;
		URL    url = new URL(this._requestURL);
		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes);
        
        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		return response.toString();
	}


}
