#Background information

I have used [Popup widget](https://developers.arcgis.com/javascript/jssamples/widget_popupfl.html) sample to demonstrate the differences between sourceURL and linkURL that are part of mediaInfos structure. Please refer to [Format Popup Content](https://developers.arcgis.com/javascript/jshelp/intro_popuptemplate.html) to know about mediaInfos property. 

#User interaction

This sample displays an image in the pop-up, which will redirect to [Esri's homepage](http://www.esri.com/) in a new tab when the image is clicked. 

#Differences between sourceURL and linkURL when using mediaInfos[] property

Please refer to code implementation in lines 90-97, which shows both sourceURL and linkURL in action. sourceURL points to the URL of the image, in our case [Media's URL](http://images6.alphacoders.com/316/316963.jpg) whereas linkURL points to the redirect URL when the media item is clicked, in our case [Esri's homepage](http://www.esri.com/). Here, sourceURL is used to display an image in the popup whereas linkURL is used to make the image clickable and re-direct to a new URL. On the other hand, you can make both sourceURL and linkURL point to the same as well. Please note that the linkURL is optional but the sourceURL is mandatory to display an image.  

#Usage 

With the use of sourceURL and linkURL, we can also display other content such as PDF via pop-up. As mentioned above, you can display an image in the pop-up by providing source URL of the image. Then, you can point to the PDF’s hyperlink in the linkURL. This way, you will be able to click the image and open the associated PDF in a new tab.