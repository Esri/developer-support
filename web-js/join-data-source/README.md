This sample dynamically joins the map service layer to an external data source like sde, geodatabase etc. and renders its symbology using the data from table.
You will need:
	1. Publish map service with dynamic layer enabled.
	2. Establish dynamic workspaces by enabling allow per request modification of layer order and symbology from Capabilities --> Mapping
	3. Manage workspace for dynamic layers. Give a Workspace ID and connect your database table to this workspace.
You will use this dynamic workspace to access your data inside the code.

[Live Sample](http://esri.github.io/developer-support/web-js/join-data-source/JoinDataSource_Final.html)
