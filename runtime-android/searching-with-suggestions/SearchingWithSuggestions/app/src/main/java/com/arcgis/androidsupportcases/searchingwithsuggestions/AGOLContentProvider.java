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

    static final String AUTHORITY = "com.arcgis.androidsupportcases.searchingwithsuggestions.agolcontentprovider";
    public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY + "/search");

    @Override
    public boolean onCreate() {
        Log.e("NOHE", "CREATED");
        Log.e("NOHE", CONTENT_URI.toString());
        return true;
    }

    @Nullable
    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {
        Log.e("NOHE", uri.getLastPathSegment());
        Cursor c = VirtualContent.getSuggestions(uri.getLastPathSegment());
        c.setNotificationUri(getContext().getContentResolver(), uri);
        return c;
    }

    @Nullable
    @Override
    public String getType(Uri uri) {
        Log.e("NOHE", "YUP");
        Log.e("NOHE", uri.toString());
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
