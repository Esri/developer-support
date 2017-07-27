# Pulse Graphic

## Use Case:
You want to bring attention to a particular graphic in your mapview.  This can be done by flashing the graphic.

## What is in this sample:
#### MainActivity.kt
This is the main activity that the user runs in their application.

Here we use an extension function so the user can call pulse on any GraphicsOverlay.
```kotlin
private fun GraphicsOverlay.pulse(period: Long) {

    val timer = Timer("pulse", false)
    timer.scheduleAtFixedRate(PulseTimer(this), 0, period)
}
```

This is the pulse timer class which explains what the exact task that needs to be run by the timer does:
```kotlin
class PulseTimer(val graphicsOverlay: GraphicsOverlay) : TimerTask() {

    var opacity = graphicsOverlay.opacity
    var goingDown = true

    override fun run() {
        opacity += (if (goingDown) (-.01f) else (.01f))

        if (opacity < .25) {
            goingDown = false
        } else if (opacity > 1.0) {
            goingDown = true
        } else {
            graphicsOverlay.opacity = opacity
        }
    }
}
```

## Useful References:

* [Kotlin Lang](https://kotlinlang.org)
* [Extension Functions](https://kotlinlang.org/docs/reference/extensions.html)
* [Timer Class Android](https://developer.android.com/reference/java/util/Timer.html)

## Special Thanks!
[Mark Dostal](https://geonet.esri.com/people/MDostal-esristaff) for his help in answering the iOS version of this [question on GeoNet](https://geonet.esri.com/message/697412-make-a-pulse-animation-in-agspicturegraphics)
