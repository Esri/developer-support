POPULATE DGRID WITH QUERRIED RESULTS

#Requirements
	- Need to use your own proxy url in esriConfig.defaults.io.proxyUrl

#Description
This sample is been a combination of multiple samples. The workflow of the sample is as follows
	1. This takes a user selected point.
	2. It selects the parcel layer
	3. Buffers the parcel layer by 200 feets
	4. Selects buildings that intersect buffer.
	5. Populates attribute data for the selected records in the DGrid.

Notice that the DGrid is populated in a floating pane.
