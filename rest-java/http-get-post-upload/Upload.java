import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;

public class Upload {

	public String _requestURL;
	public Map<String,Object> _params;
	public File _file;
	
	
	public Upload(String requestURL, Map<String,Object> params, File file){
		if(params == null || requestURL == null || file == null){
			return;
		}
		this._params = params;
		this._requestURL = requestURL;
		this._file = file;
	}
	
	public String execute() throws Exception {
		String response = null;
        try {
        	CloseableHttpClient httpclient = HttpClients.createDefault();
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
    		for (Map.Entry<String,Object> param : this._params.entrySet()) {
                builder.addTextBody(URLEncoder.encode(param.getKey(), "UTF-8"),URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
            }
            HttpPost httppost = new HttpPost(this._requestURL);
            httppost.setEntity(builder.build());
            CloseableHttpResponse httpresponse = httpclient.execute(httppost);
            BufferedReader in = new BufferedReader(new InputStreamReader((InputStream) httpresponse.getEntity().getContent()));
    		String inputLine;
    		StringBuffer response_string = new StringBuffer();

    		while ((inputLine = in.readLine()) != null) {
    			response_string.append(inputLine);
    		}
    		in.close();
    		response = response_string.toString();
    		
        }catch(IOException ex){
        	System.out.println(ex.toString());
        }
        
        return response;
	}
}
