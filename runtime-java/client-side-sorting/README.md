#Sort The Results of a Query on The Client
##About
When a query is performed on an ArcGIS Server service it is possible to sort the results of the query if the server supports advanced queries. However many runtime applications are created to work in an offline environment and are used to query offline geodatabases. While it is possible to query an offline geodatabase the setOrderByFields parameter of the QueryParameters class is not supported. This sample shows how to query an offline geodatabase and sort the results of the query on the client.
##Usage Notes
This sample is designed to work with a geodatabase from a specific service. An offline geodatabase is included to allow this sample to be downloaded and used more easily. Change the path to the geodatabase on line 21 to use this sample.
##The Logic
Access the result of the query operation and create an array of unsorted features
```Java
featureTable.queryFeatures(queryParams, new CallbackListener<FeatureResult>(){
	@Override
	public void onCallback(FeatureResult objs) {
		//Create a new Feature array
		Feature[] arrayToSort = new Feature[(int) objs.featureCount()];
		int i = 0;
		//Loop through the results
		for(Object object : objs) {
			//Access each result feature and push it to the array created above
			Feature feature = (Feature) object;
			arrayToSort[i] = feature;
			i++;
		}
		//Call the prepareSort function. Pass in the unsorted array, the field to sort and a boolean representing an ascending sort
		Feature[] sortedArray = prepareSort(arrayToSort, sortField, true);
	}
}
```
The prepareSort function checks to see if the sort field is numeric.
```Java
private Feature[] prepareSort(Feature[] arrayToSort, String fieldName, boolean ascending) {
	try {
		//if Integer.valueOf succeeded, the field is numeric
		Integer.valueOf((String) arrayToSort[0].getAttributeValue(fieldName).toString());
		return sortNumberArray(arrayToSort, fieldName, ascending);
	}
	catch (Exception e){
		//if Integer.valueOf failed, this is a text field
		return sortStringArray(arrayToSort, fieldName, ascending);
	}
}
```
Use a simple bubble sort to sort the features and return a sorted array
```Java
private Feature[] sortStringArray(Feature[] arrayToSort, String fieldName, boolean ascending) {
	Feature temp;
	for(int i = 0; i < arrayToSort.length; i++) {
		for(int j = 1; j < (arrayToSort.length-i); j++) {
			//check to see if the field should be sorted ascending
			if(ascending) {
				//because this is a string field, convert the attribute value to a string and compare the strings using the compareToIgnoreCase method
				if(arrayToSort[j-1].getAttributeValue(fieldName).toString().compareToIgnoreCase(arrayToSort[j].getAttributeValue(fieldName).toString()) > 0) {
					temp = arrayToSort[j-1];
					arrayToSort[j-1] = arrayToSort[j];
					arrayToSort[j] = temp;
				}
			}
			else {
				if(arrayToSort[j-1].getAttributeValue(fieldName).toString().compareToIgnoreCase(arrayToSort[j].getAttributeValue(fieldName).toString()) < 0) {
					temp = arrayToSort[j-1];
					arrayToSort[j-1] = arrayToSort[j];
					arrayToSort[j] = temp;
				}
			}
		}
	}
	return arrayToSort;
}
```