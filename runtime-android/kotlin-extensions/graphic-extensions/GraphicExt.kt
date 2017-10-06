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
