package com.arcgis.androidsupportcases.usingoauth;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.esri.arcgisruntime.ArcGISRuntimeEnvironment;
import com.esri.arcgisruntime.LicenseInfo;
import com.esri.arcgisruntime.concurrent.ListenableFuture;
import com.esri.arcgisruntime.loadable.LoadStatus;
import com.esri.arcgisruntime.portal.Portal;
import com.esri.arcgisruntime.security.OAuthLoginManager;
import com.esri.arcgisruntime.security.OAuthTokenCredential;

import java.util.concurrent.ExecutionException;

/**
 * Created by alex7370 on 1/4/2017.
 */
public class OAuthManagement {

    private OAuthLoginManager oAuthLoginManager;
    private Portal portal;

    private static OAuthManagement ourInstance = new OAuthManagement();

    public static OAuthManagement getInstance() {
        return ourInstance;
    }

    private OAuthManagement() {
        oAuthLoginManager = new OAuthLoginManager("https://arcgis.com", "YOUR_CLIENT_ID", "com.arcgis.androidsupportcases://myCode", 2147483646);
    }

    public void LaunchLogin(Context context) {
        oAuthLoginManager.launchOAuthBrowserPage(context);
    }

    public void handleTokenCredential(Intent intent) {
        portal = new Portal("https://www.arcgis.com", true);
        ListenableFuture<OAuthTokenCredential> futureToken = oAuthLoginManager.fetchOAuthTokenCredentialAsync(intent);

        try {
            OAuthTokenCredential oAuthTokenCredential = futureToken.get();
            portal.setCredential(oAuthTokenCredential);
            portal.loadAsync();
            portal.addDoneLoadingListener(new Runnable() {
                @Override
                public void run() {
                    if(portal.getLoadStatus() == LoadStatus.LOADED) {
                        ArcGISRuntimeEnvironment.setLicense(portal.getPortalInfo().getLicenseInfo());
                    }
                }
            });

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
