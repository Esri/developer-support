package com.esri.samples;
//Bootstrapper.java.
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import com.esri.arcgis.geometry.Point;
import com.esri.arcgis.system.AoInitialize;
import com.esri.arcgis.system.EngineInitializer;
import com.esri.arcgis.system.esriLicenseProductCode;
import com.esri.arcgis.catalog.GxFilterFeatureClasses;
import com.esri.arcgis.catalog.IEnumGxObject;
import com.esri.arcgis.catalog.IGxDataset;
import com.esri.arcgis.catalog.IGxDatasetProxy;
import com.esri.arcgis.catalog.IGxObjectProperties;
import com.esri.arcgis.catalog.IGxObjectPropertiesProxy;
import com.esri.arcgis.catalogUI.GxDialog;
import com.esri.arcgis.catalogUI.IGxDialog;
import com.esri.arcgis.system.EngineInitializer;

public class Bootstrapper
{
    public static void main(String[] args)throws Exception
    {
        bootstrapArcobjectsJar();
        //Replace the following line with the name of your main application.
        // App.main(args);

        Form.main(args);

        System.out.println("done.");
    }

    public static void bootstrapArcobjectsJar()
    {

    	/*Argument for System.getenv() is either
    	 * AGSENGINEJAVA
    	 * or
    	 *  AGSDESKTOPJAVA
    	 *  depending on whether you are using an Engine or Desktop binding
    	 */
        String arcEngineHome = System.getenv("AGSDESKTOPJAVA");
        String jarPath = arcEngineHome + "java" + File.separator + "lib" +
            File.separator + "arcobjects.jar";

        File f = new File(jarPath);

        URLClassLoader sysloader = (URLClassLoader)
            ClassLoader.getSystemClassLoader();
        Class sysclass = URLClassLoader.class;

        try
        {

            Method method = sysclass.getDeclaredMethod("addURL", new Class[]
            {
                URL.class
            }
            );
            method.setAccessible(true);
            method.invoke(sysloader, new Object[]
            {
                f.toURL()
            }
            );

        }
        catch (Throwable t)
        {

            t.printStackTrace();
            System.err.println(
                "Could not add arcobjects.jar to system classloader");

        }
    }
}
