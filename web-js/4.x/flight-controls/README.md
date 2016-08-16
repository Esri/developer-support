#Keyboard "Flight" Controls

##About
This is a simple application showing how to control the position of the camera in a SceneView with keyboard commands.

[Live Sample](http://nhaney90.github.io/flight-controls/index.html)

##Usage Notes

The keyboard commands can be shown by clicking the "Show Map Controls" button. The map MUST be in focus to use keyboard commands. Click the map to bring it into focus. The range slider allows you to increase the map movement speed. There are 7 preset locations which can be reached by clicking the buttons in the two button groups.

##How it works:
The following snippets highlight the important portions of the code.

Access the selected location from the places object. Create a new camera using the position, tilt and heading properties of the selected location. Call the animateTo method of the view to set the camera to the new location.
```javascript
var scene = routes[evt.target.id];
point = new Point({
	x: scene.x,
	y: scene.y,
	z: scene.z,
	spatialReference: 4326
});		
var camera = new Camera({
	position: point,
	tilt: scene.tilt,
	heading: scene.heading,
	fov: 100
});
view.animateTo(camera);
```
Listen for the keypress event. Based on the key that was pressed call the appropriate function to change the position of the camera.
```javascript
window.onkeypress = function(evt) {
	switch(evt.keyCode) {
		case 97: rotateLeft(); break;
		case 100: rotateRight(); break;
		case 119: tiltUp(); break;
		case 115: tiltDown(); break;
		case 113: moveHigher(); break;
		case 101: moveLower(); break;
	}
}
```
