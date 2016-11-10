package com.arcgis.androidsupportcases.searchingwithsuggestions.Data;

import android.app.SearchManager;
import android.database.MatrixCursor;
import android.os.AsyncTask;
import android.util.Log;

import com.esri.core.tasks.geocode.Locator;
import com.esri.core.tasks.geocode.LocatorSuggestionParameters;
import com.esri.core.tasks.geocode.LocatorSuggestionResult;

import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Created by alex7370 on 11/9/2016.
 */

/**
 * General notes.
 * Creating a Cursor without a table
 *
 If your search suggestions are not stored in a table format (such as an SQLite table) using the
 columns required by the system, then you can search your suggestion data for matches and then format
 them into the necessary table on each request. To do so, create a MatrixCursor using the required
 column names and then add a row for each suggestion using addRow(Object[]). Return the final
 product from your Content Provider's query() method.
 */

public class VirtualContent {

    //This is what is invoked when the query in the AGOLContentProvider is called.
    //This returns a new cursor so we can see the search suggestions in our widget.
    public static MatrixCursor getSuggestions(String query) {

        MatrixCursor mC = new MatrixCursor(new String[] {"_id", SearchManager.SUGGEST_COLUMN_TEXT_1, SearchManager.SUGGEST_COLUMN_INTENT_DATA});

        try {
            mC = new SuggestionsGet().execute(query).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        return mC;
    }

    //This runs the LocatorSuggestions asynchronously as to avoid ANR errors.
    private static class SuggestionsGet extends AsyncTask<String, Void, MatrixCursor> {

        private final String TAG = "ESS";

        @Override
        protected MatrixCursor doInBackground(String... strings) {

            MatrixCursor mC = new MatrixCursor(new String[]{"_id", SearchManager.SUGGEST_COLUMN_TEXT_1, SearchManager.SUGGEST_COLUMN_INTENT_DATA});

            for(String query : strings) {

                Locator locator = Locator.createOnlineLocator();
                List<LocatorSuggestionResult> lsr = null;
                try {
                    lsr = locator.suggest(new LocatorSuggestionParameters(query));
                } catch (Exception e) {
                    e.printStackTrace();
                }

                int i = 0;
                for (LocatorSuggestionResult result : lsr) {
                    Log.d(TAG, result.getText());
                    mC.addRow(new Object[]{i, result.getText(), i});
                    i++;
                }
                SuggestionHolder.getInstance().PopulateSuggestions(lsr);
            }
            return mC;
        }

    }

}
