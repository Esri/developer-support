package com.arcgis.androidsupportcases.searchingwithsuggestions;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.UriMatcher;
import android.database.Cursor;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;

import com.arcgis.androidsupportcases.searchingwithsuggestions.Data.VirtualContent;

/**
 * Created by alex7370 on 11/9/2016.
 */

public class AGOLContentProvider extends ContentProvider {

    //A static reference to the authority so we can see what it looks like.
    static final String AUTHORITY = "com.arcgis.androidsupportcases.searchingwithsuggestions.agolcontentprovider";
    public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY + "/search");

    private final String TAG = "ESS";

    //This lets us know that the content provider was created.  This can be used to check while the
    //application is being debugged.
    @Override
    public boolean onCreate() {
        Log.d(TAG, "CREATED");
        Log.d(TAG, CONTENT_URI.toString());
        return true;
    }

    //This is what powers the search suggestions.  As the user types in the search widget,
    //this will go and recreate the cursor from ArcGIS Online to get realtime suggestions
    //on what the user is typing.
    @Nullable
    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {
        Log.d(TAG, uri.getLastPathSegment());
        Cursor c = VirtualContent.getSuggestions(uri.getLastPathSegment());
        c.setNotificationUri(getContext().getContentResolver(), uri);
        return c;
    }

    @Nullable
    @Override
    public String getType(Uri uri) {
        Log.e(TAG, uri.toString());
        return null;
    }

    @Nullable
    @Override
    public Uri insert(Uri uri, ContentValues contentValues) {
        return null;
    }

    @Override
    public int delete(Uri uri, String s, String[] strings) {
        return 0;
    }

    @Override
    public int update(Uri uri, ContentValues contentValues, String s, String[] strings) {
        return 0;
    }


}
