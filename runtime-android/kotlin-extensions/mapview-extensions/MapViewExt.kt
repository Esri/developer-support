/**
* A function to disable rotation on a mapview
*/
fun MapView.disableRotation() {
        this.onTouchListener = NoRotate(this.context, this)
}

/**
* A private class used to disable rotation on the MapView.
* Used exclusively with the disableRotation method.
*/
private class NoRotate(context: Context, mapView: MapView) : DefaultMapViewOnTouchListener(context, mapView) {

        override fun onRotate(event: MotionEvent, rotationAngle: Double): Boolean {
            Log.d("NoRotateClass", "ROTATED")
            return true
        }

        override fun onLongPress(e: MotionEvent) {
            Log.d("NoRotateClass", "SANITY")
            super.onLongPress(e)
        }
    }
