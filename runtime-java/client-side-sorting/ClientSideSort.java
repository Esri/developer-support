import java.awt.BorderLayout;
import java.io.FileNotFoundException;

import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLayeredPane;
import javax.swing.SwingUtilities;

import com.esri.core.geodatabase.Geodatabase;
import com.esri.core.geodatabase.GeodatabaseFeatureTable;
import com.esri.core.map.CallbackListener;
import com.esri.core.map.Feature;
import com.esri.core.map.FeatureResult;
import com.esri.core.tasks.query.QueryParameters;
import com.esri.map.ArcGISTiledMapServiceLayer;
import com.esri.map.JMap;

public class ClientSideSort {

  final String URL_TILED_LAYER = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";
  final String FILEPATH = "C:\\Users\\nich7712\\Desktop\\MyGDB.geodatabase";

  private JMap map;
  private Geodatabase geodatabase;
  private GeodatabaseFeatureTable featureTable;
  //The field used to sort the results of the query
  private String sortField = "type";

  public ClientSideSort() {}

  private void  addFeatureLayer() {

	try {
		//Create a new geodatabase object
		geodatabase = new Geodatabase(FILEPATH);
		//Create a feature table from the first feature table in the geodatabase
		featureTable = geodatabase.getGeodatabaseFeatureTableByLayerId(0);
		//Call the queryTable function
		queryTable();
	} catch (FileNotFoundException e) {
		e.printStackTrace();
	}
  }
  
  private void queryTable() {
	  //Set the outfields
	  String[] outFields = {sortField};
	  QueryParameters queryParams = new QueryParameters();
	  queryParams.setOutFields(outFields);
	  //Set the where clause of the query. Here we are basically returning all features
	  queryParams.setWhere("objectid > 0");
	  //Query the feature table and process results
	  featureTable.queryFeatures(queryParams, new CallbackListener<FeatureResult>(){
		@Override
		public void onCallback(FeatureResult objs) {
			//Create a new Feature array
			Feature[] arrayToSort = new Feature[(int) objs.featureCount()];
			int i = 0;
			//Loop through the results
			for(Object object : objs) {
				//Access each result feature and push it to the array created above
				Feature feature = (Feature) object;
				arrayToSort[i] = feature;
				i++;
			}
			//Call the prepareSort function. Pass in the unsorted array, the field to sort and a boolean representing an ascending sort
			Feature[] sortedArray = prepareSort(arrayToSort, sortField, true);
			//Loop through the sortedArray and print the results to the console
			for(Feature feature : sortedArray) {
				System.out.println(feature.getAttributeValue(sortField));
			}
		}

		@Override
		public void onError(Throwable e) {
			e.printStackTrace();
		}
		  
	  });
  }
  
  //This function determines if the sort field is a number or a string
  private Feature[] prepareSort(Feature[] arrayToSort, String fieldName, boolean ascending) {
	  try {
		  //if Integer.valueOf succeeded, the field is numeric
		  Integer.valueOf((String) arrayToSort[0].getAttributeValue(fieldName).toString());
		  return sortNumberArray(arrayToSort, fieldName, ascending);
	  }
	  catch (Exception e){
		  //this is a string field
		  return sortStringArray(arrayToSort, fieldName, ascending);
	  }
  }
  
  //Implement a bubble sort
  private Feature[] sortStringArray(Feature[] arrayToSort, String fieldName, boolean ascending) {
	  Feature temp;
	  for(int i = 0; i < arrayToSort.length; i++) {
		  for(int j = 1; j < (arrayToSort.length-i); j++) {
			  if(ascending) {
				  //convert the attribute value to a string and compare the strings using the compareToIgnoreCase method
				  if(arrayToSort[j-1].getAttributeValue(fieldName).toString().compareToIgnoreCase(arrayToSort[j].getAttributeValue(fieldName).toString()) > 0) {
					  temp = arrayToSort[j-1];
					  arrayToSort[j-1] = arrayToSort[j];
					  arrayToSort[j] = temp;
				  }
			  }
			  else {
				  if(arrayToSort[j-1].getAttributeValue(fieldName).toString().compareToIgnoreCase(arrayToSort[j].getAttributeValue(fieldName).toString()) < 0) {
					  temp = arrayToSort[j-1];
					  arrayToSort[j-1] = arrayToSort[j];
					  arrayToSort[j] = temp;
				  }
			  }
		  }
	  }
	  return arrayToSort;
  }
  
  //Implement a bubble sort
  private Feature[] sortNumberArray(Feature[] arrayToSort, String fieldName, boolean ascending) {
	  Feature temp;
	  for(int i = 0; i < arrayToSort.length; i++) {
		  for(int j = 1; j < (arrayToSort.length-i); j++) {
			  if(ascending) {
				  //parse a double from the attribute field. Double is used as it will work regardless of the numeric type of the field
				  if(Double.parseDouble(arrayToSort[j-1].getAttributeValue(fieldName).toString()) > Double.parseDouble(arrayToSort[j].getAttributeValue(fieldName).toString())) {
					  temp = arrayToSort[j-1];
					  arrayToSort[j-1] = arrayToSort[j];
					  arrayToSort[j] = temp;
				  }
			  }
			  else {
				  if(Double.parseDouble(arrayToSort[j-1].getAttributeValue(fieldName).toString()) < Double.parseDouble(arrayToSort[j].getAttributeValue(fieldName).toString())) {
					  temp = arrayToSort[j-1];
					  arrayToSort[j-1] = arrayToSort[j];
					  arrayToSort[j] = temp;
				  }
			  }
		  }
	  }
	  return arrayToSort;
  }
  
  public static void main(String[] args) {
    SwingUtilities.invokeLater(new Runnable() {
      @Override
      public void run() {
        try {
        	ClientSideSort featureLayerApp = new ClientSideSort();
        	JFrame appWindow = featureLayerApp.createWindow();
        	appWindow.add(featureLayerApp.createUI());
        	appWindow.setVisible(true);
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }

  public JComponent createUI() throws Exception {
    JComponent contentPane = createContentPane();
    map =  new JMap();
    ArcGISTiledMapServiceLayer baseLayer = new ArcGISTiledMapServiceLayer(URL_TILED_LAYER);
    map.getLayers().add(baseLayer);
    addFeatureLayer();  

    contentPane.add(map);

    return contentPane;
  }

  private JFrame createWindow() {
    JFrame window = new JFrame("Client Side Sorting");
    window.setBounds(100, 100, 1000, 700);
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    window.getContentPane().setLayout(new BorderLayout(0, 0));
    return window;
  }

  private static JLayeredPane createContentPane() {
    JLayeredPane contentPane = new JLayeredPane();
    contentPane.setBounds(100, 100, 1000, 700);
    contentPane.setLayout(new BorderLayout(0, 0));
    contentPane.setVisible(true);
    return contentPane;
  }
}
