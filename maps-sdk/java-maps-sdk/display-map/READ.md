# Display a map using a shell script

## Background

This sample demonstrates how to compile & run a Java program using a shell script without an interactive development environment (IDE) like IntelliJ or Eclipse.

This app was used with ArcGIS Maps SDK for Java version 200.6 and is based on the Display Map sample.

Related Links:

    https://developers.arcgis.com/java/install-and-set-up/#getting-the-api-manually 
    https://developers.arcgis.com/java/sample-code/display-map/

## Usage notes

Some internal environments do not have the privilege or license to install an IDE like IntelliJ or Eclipse. However, a Java program can compile and run through a terminal or a command-line interpreter without these IDEs so long as the Java JDK and JavaFX components are installed on the machine.

## How to setup (Getting the API manually)

For the API dependencies:
1. Download ArcGIS Maps SDK for Java as a .zip or .tgz.

    https://developers.arcgis.com/java/downloads/#arcgis-maps-sdk-for-java

2. Extract the archive contents and copy the libs, jniLibs, and resources folders into the root of your project directory.

    Example Directory:
        
        C:/path/to/display-map/arcgis-maps-sdk-java-200.6.0

3. Add all of the jars in the libs folder to your classpath.

    Example Paths (Relative & Abolsute):

        --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*;."

        --class-path "C:/path/to/display-map/arcgis-maps-sdk-java-200.6.0/libs/*;."
      
For the OpenJFX dependencies:
1. Download the OpenJFX SDK (17.0.13 or 21.0.5) from Gluon.
2. Extract the archive contents and copy the directory into the root of your project directory.
3. Add the JavaFX jars to your module path. The API requires the javafx.controls, javafx.fxml, javafx.web, javafx.media, and javafx.graphics modules. Refer to Gluon's documentation for setup instructions.

    Example Paths (Relative & Abolsute):

        --module-path "./javafx-sdk-21.0.2/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics

        --module-path "C:/path/to/javafx-sdk-21.0.2/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics
        

## Build & run the Java program with the build.sh file
If using Windows:
1. Install Git for Windows which will include BASH emulation to run the shell script.
2. Open the build.sh file and uncomment the javac and java commands for the Windows setup.
3. Change javafx-sdk-xx.x.x to your JavaFX version and directory path.

    Example Paths (Relative & Abolsute):
    
        ./javafx-sdk-21.0.2/lib

        C:/path/to/javafx-sdk-21.0.2/lib
4. Run the build.sh file.

If using Linux:
1. Open the build.sh file and uncomment the javac and java commands for the Linux setup.
2. Change javafx-sdk-xx.x.x to your JavaFX version and directory path.

    Example Paths (Relative & Abolsute):

        ./javafx-sdk-21.0.2/lib

        /path/to/javafx-sdk-21.0.2/lib
3. Run the build.sh file.

How to build & run the Java program without Git BASH for Windows or the shell script:
1. Install the Java JDK and JavaFX components on the machine.
2. Open a command-prompt and copy-paste the same javac command below.
3. Be sure to change javafx-sdk-xx.x.x to your JavaFX version and directory path.
4. Run the javac command to create the .class file.
5. Copy-paste the same java command below.
6. Be sure to change javafx-sdk-xx.x.x to your JavaFX version and directory path.
7. Run the java command to execute the .class file.

The same workflow is applicable to a Linux terminal.

## Java compiler & launcher commands

```java
javac --module-path "./javafx-sdk-xx.x.x/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*;." MainClass.java

java --module-path "./javafx-sdk-xx.x.x/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*;." MainClass
```

## Example javac and java commands with ArcGIS Maps SDK for version 200.6.0 and JavaFX SDK version 21.0.2
```java
javac --module-path "C:/path/to/javafx-sdk-21.0.2/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "C:/path/to/arcgis-maps-sdk-java-200.6.0/libs/*;." MainClass.java

java --module-path "C:/path/to/javafx-sdk-21.0.2/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "C:/path/to/arcgis-maps-sdk-java-200.6.0/libs/*;." MainClass
```

## Other Notes
The difference between the Linux and Windows commands are the class-path separators. Windows uses semicolons (;) while Linux uses colons (:).

javac (Java Compiler)

    This command is used to compile Java source code files (which have the .java extension) into Java bytecode (which results in .class files).

java (Java Launcher/Interpreter)

    This command is used to run or execute the compiled Java bytecode (.class files).