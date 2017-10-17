# Antipode Processor

This sample seeks to demonstrate how to manipulate point geometry for a GeoEvent in a custom GeoEvent Processor.  This processor takes input point geometry data that is in latitude and longitude and converts the point geometry to the antipode, the direct opposite location on the Earth.

## Sections

* [Requirements](#requirements)
* [Building](#building)
* [Installation](#installation)
* [Testing](#testing)

## Requirements

* See common [solutions-geoevent-java requirements](https://github.com/Esri/solutions-geoevent-java/blob/README.md#requirements)
* The ArcGIS Runtime for Java SDK is required in order to run the standalone Maven Tests included with this project

## Building

* See the [solutions-geoevent-java instructions](https://github.com/Esri/solutions-geoevent-java/blob/README.md#instructions) for general instructions on
    * verifying your Maven installation
    * setting the location of the GEP Server and GEP SDK repositories
    * and any other common required steps
 * Open a command prompt and navigate to `solutions-geoevent-java/solutions-geoevent/processors/updateOnly-processor`
 * * Enter `mvn install` at the prompt

## Installation

* Install the processor
    * Browse to `solutions-geoevent-java/solutions-processors/updateOnly-processor/target` (this directory is created when you execute mvn install).
    * Copy the jar file and paste it into the deploy directory on your GeoEvent Processor server (<GEP install location>\deploy\ -- default location is C:\Program Files\ArcGIS\Server\GeoEventProcessor\deploy)
    * Open the GeoEvent Processor Manager web application and ensure that the UpdateOnlyProcessor processor is present on the 'Site' > 'Components' > 'Processors' page.

## Testing

### Validating the Installation

* See the [solutions-geoevent-java validation instructions](https://github.com/Esri/solutions-geoevent-java/blob/master/README.md#validating-install)..
