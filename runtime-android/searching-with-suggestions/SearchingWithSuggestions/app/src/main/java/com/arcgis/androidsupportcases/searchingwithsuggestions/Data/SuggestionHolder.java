package com.arcgis.androidsupportcases.searchingwithsuggestions.Data;

import android.os.AsyncTask;

import com.esri.core.geometry.SpatialReference;
import com.esri.core.tasks.geocode.Locator;
import com.esri.core.tasks.geocode.LocatorGeocodeResult;
import com.esri.core.tasks.geocode.LocatorSuggestionResult;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Created by alex7370 on 11/10/2016.
 * A singleton class so we can access the LocatorSuggestionResult directly and use that to its full
 * potential.  This would simulate the magickey call via the REST API.
 */
public class SuggestionHolder {

    private static SuggestionHolder ourInstance = new SuggestionHolder();

    private ArrayList<LocatorSuggestionResult> lsr;

    public static SuggestionHolder getInstance() {
        return ourInstance;
    }

    private SuggestionHolder() {
        lsr = new ArrayList<>();
    }

    //This ensures that the arraylist holds the correct data to be accessed outside the content provider
    public void PopulateSuggestions(List<LocatorSuggestionResult> lsrArray) {
        lsr.clear();
        for(LocatorSuggestionResult ls : lsrArray) {
            lsr.add(ls);
        }
    }

    //Called from the MainActivity so we can interact with the search suggestions directly.
    public LocatorGeocodeResult FindFeatureFromSearch(int index) {
        LocatorGeocodeResult lgr = new LocatorGeocodeResult();
        try {
            lgr = new GetLocatorResult().execute(index).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return lgr;
    }

    //Runs geocoding async so we do not block the thread.
    private class GetLocatorResult extends AsyncTask<Integer, Void, LocatorGeocodeResult> {

        List<String> outFields = new ArrayList<>();

        @Override
        protected LocatorGeocodeResult doInBackground(Integer... indexs) {
            List<LocatorGeocodeResult> lgr = new ArrayList<>();
            try {
                outFields.add("*");
                lgr = Locator.createOnlineLocator().find(lsr.get(indexs[0]),1, outFields, SpatialReference.create(SpatialReference.WKID_WGS84_WEB_MERCATOR));
            } catch (Exception e) {
                e.printStackTrace();
            }

            return lgr.get(0);
        }
    }

}

