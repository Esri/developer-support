package com.arcgis.apps.pulsegraphic

import android.graphics.Color
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.SpatialReferences
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.Basemap
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.symbology.SimpleMarkerSymbol
import kotlinx.android.synthetic.main.activity_main.*
import java.util.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        mapView.map = ArcGISMap(Basemap.createDarkGrayCanvasVector())

        val pulseOverlay = GraphicsOverlay(GraphicsOverlay.RenderingMode.DYNAMIC)

        mapView.graphicsOverlays.add(pulseOverlay)

        var graphic = Graphic(Point(0.0, 0.0, SpatialReferences.getWgs84()), SimpleMarkerSymbol(SimpleMarkerSymbol.Style.CIRCLE, Color.RED, 28.0f))

        pulseOverlay.graphics.add(graphic)
        pulseOverlay.pulse(20)
    }
}

private fun GraphicsOverlay.pulse(period: Long) {

    val timer = Timer("pulse", false)
    timer.scheduleAtFixedRate(PulseTimer(this), 0, period)

}

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
