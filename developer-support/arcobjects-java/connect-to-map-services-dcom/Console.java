package Esri.SDK;

import java.io.IOException;
import java.net.UnknownHostException;

import com.esri.arcgis.carto.ILayer;
import com.esri.arcgis.carto.IMap;
import com.esri.arcgis.carto.MapServer;
import com.esri.arcgis.interop.AutomationException;
import com.esri.arcgis.server.IServerContext;
import com.esri.arcgis.server.IServerObjectManager;
import com.esri.arcgis.server.ServerConnection;
import com.esri.arcgis.system.AoInitialize;
import com.esri.arcgis.system.ServerInitializer;

public class Console {

	private static IServerContext serverContext;

	public static void main(String[] args) throws AutomationException, IOException {
		checkoutLicense(); //Get license
		try {
			serverContext = getServerContext();
			printLayers();
			clearLayers();
			refresh();
		} catch (IOException e) {
		        e.printStackTrace();
		} finally {
		        serverContext.releaseContext();
		        System.out.println("Released context connection...");       
		}
	}

	private static void refresh() {
		try {
			MapServer mapServer = (MapServer) serverContext.getServerObject();
			mapServer.refreshServerObjects();
			System.out.println("Refreshed server object..."); 
		} catch (AutomationException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}

	private static IServerContext getServerContext() {
		ServerConnection connection;
		try {
			connection = new ServerConnection();
			connection.connect("MyMachineName");
			IServerObjectManager som = connection.getServerObjectManager();
			IServerContext serverContext = som.createServerContext("Access", "MapServer");
			return serverContext;
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private static void printLayers()
			throws IOException, AutomationException {
		MapServer mapServer = (MapServer) serverContext.getServerObject();
		System.out.println("Getting ready to print layers...");
		String name = mapServer.getDefaultMapName();
		IMap pMap = mapServer.getMap(name);
		int count = pMap.getLayerCount();
		if(count <= 0)
		{
			System.out.println("Map has zero layers!");
		}
		for(int i = 0; i < count; i++)
		{
			ILayer layer = pMap.getLayer(i);
			System.out.println(layer.getName());
		}
	}
	
	private static void clearLayers() throws IOException, AutomationException {
		MapServer mapServer = (MapServer) serverContext.getServerObject();
		String name = mapServer.getDefaultMapName();
		IMap pMap = mapServer.getMap(name);
		pMap.clearLayers();
		System.out.println("Cleared map layers!");
	}
	
	private static void checkoutLicense() {
		try {
			com.esri.arcgis.system.AoInitialize ao = null;
			if (ao == null) {
				//initialize a server 
				ServerInitializer si = new ServerInitializer();
				si.initializeServer("avworld", "domain user", "domain password");
				ao = new AoInitialize();
				int licStatus = ao
						.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeArcServer);
				System.out.println("Lic status: " + licStatus);
			}

		} catch (UnknownHostException e) {
			String msg = "%s: %s";
			msg = String.format(msg, e.getClass().getName(), e.getMessage());
			System.out.println(msg);
		} catch (IOException e) {
			String msg = "%s: %s";
			msg = String.format(msg, e.getClass().getName(), e.getMessage());
			System.out.println(msg);
		}
		
	}
}
