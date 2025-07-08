import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

import com.esri.arcgisruntime.ArcGISRuntimeEnvironment;
import com.esri.arcgisruntime.mapping.ArcGISMap;
import com.esri.arcgisruntime.mapping.BasemapStyle;
import com.esri.arcgisruntime.mapping.view.MapView;

public class MainClass extends Application
{
  private ArcGISMap map;
  private MapView mapView;

  @Override
  public void start(Stage stage)
  {
      ArcGISRuntimeEnvironment.setInstallDirectory("./arcgis-maps-sdk-java-200.6.0");
	    ArcGISRuntimeEnvironment.setApiKey("API KEY HERE");
      try
      {
        StackPane stackPane = new StackPane();
        Scene scene = new Scene(stackPane);

        stage.setTitle("Display Map Sample");
        stage.setWidth(800);
        stage.setHeight(700);
        stage.setScene(scene);
        stage.show();

        // create a map with the streets basemap style
        map = new ArcGISMap(BasemapStyle.ARCGIS_STREETS);

        // create a map view and set the map to it
        mapView = new MapView();
        mapView.setMap(map);

        stackPane.getChildren().addAll(mapView);
      }
      catch (Exception e) {
          System.out.println(e.getMessage());
      }
  }

  @Override
  public void stop() {

    if (mapView != null) {
      mapView.dispose();
    }
  }

  public static void main(String[] args)
  {
    System.out.println("Launching JavaFX");
    Application.launch(args);
    System.out.println("Finished");
  }
}
