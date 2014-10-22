package esri.support.basicgps;


import java.util.Collection;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.view.View;
import android.widget.RadioButton;
import android.widget.TextView;
import android.location.*;

public class MainActivity extends Activity implements GpsStatus.Listener {

	public TextView heading;
	public LocationManager locationManager;
	public LocationListener listener;
	public TextView lat;
	public TextView lon;
	public TextView status;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		heading = (TextView) findViewById(R.id.heading);
		SpannableString content = new SpannableString(getText(R.string.heading));
		content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
		heading.setText(content);
		
		//UI
		lat = (TextView) findViewById(R.id.lat);
		lon = (TextView) findViewById(R.id.lon);
		status = (TextView) findViewById(R.id.status);
	}

	public void onRadioButtonClicked(View view) {
		boolean checked = ((RadioButton) view).isChecked();
		stopUpdates();
		switch (view.getId()) {
		case R.id.gps:
			if (checked)
				startUpdatesNoCriteria();
				break;
		case R.id.fine:
			if (checked)
				startUpdatesWithCriteria(getCriteria(Criteria.ACCURACY_FINE));
				break;
		case R.id.course:
			if (checked)
				startUpdatesWithCriteria(getCriteria(Criteria.ACCURACY_COARSE));
				break;
		case R.id.off:
			if (checked)
				//everything gets stopped always
				break;
		}
	}
	private void stopUpdates() {
		// TODO Auto-generated method stub
		if(locationManager != null) {
			locationManager.removeUpdates(listener);
			locationManager = null;
		}
		lat.setText("");
	    lon.setText("");
		
	}
	
	public void startUpdatesNoCriteria(){
		// http://stackoverflow.com/questions/6775257/android-location-providers-gps-or-network-provider
		locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		locationManager.addGpsStatusListener(this);
	    listener = new LocationListener(){
	    	public void onLocationChanged(Location location) {
	    	    lat.setText("Lat: " +   location.getLatitude());
	    	    lon.setText("Long: " + location.getLongitude());
	    	}
	    	public void onProviderDisabled(String provider) {}
	    	public void onProviderEnabled(String provider) {}
	    	public void onStatusChanged(String provider, int status, Bundle extras) {}
	    };
		locationManager.requestLocationUpdates("gps",1000, 5, listener);
	}


	public void startUpdatesWithCriteria(Criteria c){
		locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
	    listener = new LocationListener(){
	    	public void onLocationChanged(Location location) {
	    	    lat.setText("Lat: " +   location.getLatitude());
	    	    lon.setText("Long: " + location.getLongitude());
	    	}
	    	public void onProviderDisabled(String provider) {}
	    	public void onProviderEnabled(String provider) {}
	    	public void onStatusChanged(String provider, int status, Bundle extras) {}
	    };
		locationManager.requestLocationUpdates(1000, 5, c, listener,null);
	}
	
	public Criteria getCriteria(int accuracy) {
		Criteria c = new Criteria();
		c.setAccuracy(accuracy);
		c.setAltitudeRequired(true);
		c.setBearingRequired(true);
		c.setSpeedRequired(true);
		c.setCostAllowed(true);
		return c;
	}
	
	public int getSataliteEngineScore(Iterable<GpsSatellite> values)
	{
		if (values instanceof Collection)
			return ((Collection<?>)values).size();
		int i = 0;
		for (GpsSatellite s : values) i++;
		return i;	
	}

	@Override
	//Good discussion http://stackoverflow.com/questions/2021176/how-can-i-check-the-current-status-of-the-gps-receiver
	public void onGpsStatusChanged(int event) {
		switch (event) {
		case 1: //GPS_EVENT_STARTED
    	    status.setText("Status: started");
			break;
		case 2: //GPS_EVENT_STOPPED
			status.setText("Status: stoped");
			break;
		case 3: //GPS_EVENT_FIRST_FIX
			status.setText("Status: first fix");
			break;
		case 4: //GPS_EVENT_SATELLITE_STATUS
			GpsStatus s = locationManager.getGpsStatus(null);
            Iterable<GpsSatellite> sats = s.getSatellites();
            int size = getSataliteEngineScore(sats);
			status.setText("Status: satellites (" + String.valueOf(size) + ")");
			break;
		}
		
	}
}