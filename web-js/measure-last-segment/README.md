README FOR MEASURE LAST SEGMENT

Added functionality to current measurement sample where it gives a measure of the last segment.
You can find the current sample here: https://developers.arcgis.com/javascript/jssamples/widget_measurement.html

The sample pushes the measured values to an array and subtract the second last number from the last measurement number.

What it does not do is:
If you have completed your measurement and if you switch the unit this sample will not convert the last measured segment's unit and show the updated value.
