/**
* This function pulses the opacity of an entire graphics overlay layer.
* This helps notify the user of selected locations on the screen by giving a
* visual cue with the opacity change.
*/
private fun GraphicsOverlay.pulseOpacity(period: Long) {

    val timer = Timer("pulse", false)
    timer.scheduleAtFixedRate(PulseOpacityTimer(this), 0, period)
}

private class PulseOpacityTimer(val graphicsOverlay: GraphicsOverlay) : TimerTask() {

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
