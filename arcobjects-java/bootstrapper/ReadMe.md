# Bootstrapper Class
## Use Case
Since all ArcGIS Engine Java applications reference class files from the arcobjects.jar library, arcobjects.jar should be present in the Java classpath when the applications are run. In some cases, the location of arcobjects.jar is not known relative to the application JAR. This is the case with Web Start applications and executable JARs. In such cases, the following helper can dynamically load arcobjects.jar from its location on disk.

## Instructions
### Binding
The argument on line 44 would need to be changed to reflect which library you are binding to.
#### Desktop Binding
If you have ArcGIS Desktop installed and are trying to use the Engine runtime that is packaged with desktop, then use the **AGSDESKTOPJAVA**. This environment variable will point to the runtime location of where ArcGIS Desktop is installed on the machine.
#### Engine Binding
If you have ArcGIS Engine Runtime installed and are trying to use this as your runtime, then use the **AGSENGINEJAVA** environment variable. This environment variable will point to the runtime location of where ArcGIS Engine is installed on the machine.

### Invoke your application within the Bootstrapper
The bootstrapper would need to be your main class with your application being invoked from it.  To do this, you would change line 30 in the main method to reflect your class and main method.

## References
* [Deployment guide - Bootstrapping](http://resources.arcgis.com/en/help/arcobjects-java/concepts/engine/index.html#//000100000694000000#Bootstrap)
* [Unable to initialize ArcObjects environment (Java API)](https://geonet.esri.com/thread/16649)

###### Compiled By
* Alexander Nohe
