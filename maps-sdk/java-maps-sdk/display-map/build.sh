#!/bin/bash

#############################
#----- FOR WINDOWS ONLY -----
#############################

# 1. Install Git for Windows.
# 2. Uncomment the javac & java command lines below if using Windows.
# 3. Change javafx-sdk-xx.x.x to your JavaFX version and directory path.
#		Example: ./javafx-sdk-21.0.2/lib
# 4. Run the build.sh file.

#javac --module-path "./javafx-sdk-xx.x.x/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*;." MainClass.java

#java --module-path "./javafx-sdk-xx.x.x/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*;." MainClass





###########################
#----- FOR LINUX ONLY -----
###########################

# 1. Uncomment the javac & java command lines below if using Linux.
# 2. Change javafx-sdk-xx.x.x to your JavaFX version and directory path.
#		Example: ./javafx-sdk-21.0.2/lib
# 3. Run the build.sh file.

#javac --module-path "./javafx-sdk-xx.x.x/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*:." MainClass.java

#java --module-path "./javafx-sdk-xx.x.x/lib" --add-modules javafx.controls,javafx.fxml,javafx.web,javafx.media,javafx.graphics --class-path "./arcgis-maps-sdk-java-200.6.0/libs/*:." MainClass