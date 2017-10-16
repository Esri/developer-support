/**
* A function that animates the movement of a marker graphic to provide a
* nice transition of a marker to a new location.
*/
fun Graphic.animatePointGraphic(handler: Handler, destination: Point) {

    handler.removeCallbacksAndMessages(null)

    val start = SystemClock.uptimeMillis()
    val duration: Long = 1000

    val graphic = this

    val interpolator = LinearInterpolator()

    handler.post(object : Runnable {
        override fun run() {
            val elapsed = SystemClock.uptimeMillis() - start
            val t = interpolator.getInterpolation(elapsed.toFloat() / duration)
            val lng = t * destination.x + (1 - t) * (graphic.geometry as Point).x
            val lat = t * destination.y + (1 - t) * (graphic.geometry as Point).y
            graphic.geometry = Point(lng, lat, graphic.geometry.spatialReference)

            if (t < 1.0) {
                // Post again 16ms later.
                handler.postDelayed(this, 16)
            }
        }
    })
}

/**
 * The puleGraphicSize method allows developers to pulse a graphic size to show the graphic
 * changing and getting larger and smaller between a range.
 */
fun Graphic.pulseGraphicSize(period: Long, min: Float = 2.0f, max: Float = 20.0f) {
    val timer = Timer("pulse", false)
    timer.scheduleAtFixedRate(SizePulseTimer(this.symbol, min, max), 0, period)
}

/**
 *
 * This class is used exclusively with the pulseGraphicSize extension function.  This allows
 * developers to easily pulse a graphic size.
 *
 */
private class SizePulseTimer(val symbol: Symbol, val min: Float = 2.0f, val max: Float = 20.0f) : TimerTask() {

    var size = 5.0f
    var goingDown = true

    override fun run() {
        when(symbol) {
            is SimpleMarkerSymbol -> symbol.size += (if (goingDown) (-.01f) else (.01f)).apply { size = symbol.size }
            is PictureMarkerSymbol -> {
                symbol.height += (if (goingDown) (-.01f) else (.01f))
                symbol.width += (if (goingDown) (-.01f) else (.01f)).apply { size = symbol.height }
            }
            is SimpleLineSymbol -> symbol.width += (if (goingDown) (-.01f) else (.01f)).apply { size = symbol.width }
            is SimpleFillSymbol -> symbol.outline.width += (if (goingDown) (-.01f) else (.01f)).apply { size = symbol.outline.width }
        }

        if (size < min) {
            goingDown = false
        } else if (size > max) {
            goingDown = true
        }
    }
}
