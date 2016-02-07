# Travel Application
This application aims to show your current location on a map and then tracks that position by continuing to track your location and showing a previous path before uploading this information to a feature service.  It has been formatted to track your speed, total distance, miles per hour, and pace.

#### Starting the application
![alt text](../../../repository-images/walkMapping1.gif "Opening application")
#### Running the application
![alt text](../../../repository-images/walkMapping2.gif "Running application")
#### Finishing the application
![alt text](../../../repository-images/walkMapping3.gif "Finishing application")

## How did we do it?
We used a timer class to time our traveling distance and format it into a human readable format:
```qml
Timer {
        id: stopwatch

        interval:  100
        repeat:  true
        running: false
        triggeredOnStart: true

        onTriggered: {
            if (numberOfDate == 0)
            {
                previousTime = new Date
                numberOfDate++;
            }
            else
            {
                var currentTime = new Date
                var delta = (currentTime.getTime() - previousTime.getTime())
                text1.text = toTime(delta)
            }
        }
    }

function toTime(usec) {

    var mod = Math.abs(usec)
    return (usec < 0 ? "-" : "") +
            (mod >= 3600000 ? Math.floor(mod / 3600000) + ':' : '') +
            zeroPad(Math.floor((mod % 3600000) / 60000)) + ':' +
            zeroPad(Math.floor((mod % 60000) / 1000)) + '.' +
            Math.floor((mod % 1000) / 100)
}

function zeroPad(n) {

    return (n < 10 ? "0" : "") + n

}
```

We used a position display object to update our position and create geometries from it.

```qml
positionDisplay {
    id: pd
    zoomScale: 17
    mode: Enums.AutoPanModeCompass;
    positionSource: PositionSource {
        id: ps
    }
    onMapPointChanged: {
        console.log(capturePoints)
        if (pd.geoPoint.x != 0 && pd.geoPoint.y != 0 && capturePoints)
        {
            if (numberOfClicks == 0) {
                previousPoint = pd.mapPoint
                console.log(numberOfClicks)
                featureLine.startPath(pd.mapPoint.x, pd.mapPoint.y)
                numberOfClicks++;
                graphic.geometry = featureLine
                graphic.symbol = simpLine
                prPoint = pd.mapPoint
                lastPointTime = new Date
            }
            else{
                nextPointTime = new Date
                tempLine.startPath(prPoint)
                tempLine.lineTo(pd.mapPoint)
                text3.text = ((tempLine.calculateLength2D() * .000621371)/ ((nextPointTime.getTime() - lastPointTime.getTime())*0.000000278)).toFixed(2) + "MpH"
                text4.text = ((((nextPointTime.getTime() - lastPointTime.getTime())*0.000000278) * 60) / (tempLine.calculateLength2D() * .000621371)).toFixed(2) +"minutsPerMile"

                tempLine.closeAllPaths()
                tempLine.removePath(-1)
                prPoint = pd.mapPoint
                lastPointTime = nextPointTime

                featureLine.lineTo(pd.mapPoint.x, pd.mapPoint.y)
                graphic.geometry = featureLine
                graphic.symbol = simpLine
                text2.text = (featureLine.calculateLength2D() * .000621371).toFixed(2) + " miles"
            }
        }
    }
}
```

## Resources

* [PositionDisplay Class Reference](https://developers.arcgis.com/qt/qml/api-reference/class_position_display.html)

* [Edit features guide](https://developers.arcgis.com/qt/qml/guide/edit-features.htm)

* [Hosted Data Editor](https://developers.arcgis.com/en/hosted-data/)

* [Position DisplayGuide](https://developers.arcgis.com/qt/qml/guide/position-display.htm)
