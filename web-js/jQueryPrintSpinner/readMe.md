#Print Service Loading Spinner

##Background
This sample shows how to add a jQuery spinner when the print request is fired off. It stops spinning when the print job has completed. This can inform users that the print task is in the process of executing and will be completed soon.


##Requirements
Please note that this sample requires you to download and host the following.

1. jquery-spin
2. css files
3. javascript files  

[Download jquery-spin](http://ksylvest.github.io/jquery-spin/)

##Usage notes:


```html
<!--make sure to add the jQuery library, jquery.spin.js and jquery.spin.css in the head -->

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js" type="text/javascript"></script>
<script src="javascript/jquery.spin.js" type="text/javascript"></script>
<link href="stylesheets/jquery.spin.css" rel="stylesheet" type="text/css" />

```

```javascript
//hide the spinner when the application loads
$('.spin').spin('hide');


//use the print-start event when the request is sent to the print service
app.printer.on('print-start',function(){
//READY...SET...Start your SPINNERS
//show the spinner to show that the task is executing
$('.spin').spin();
$('.spin').spin('show');
console.log('The print operation has started');
});


//use the print-complete event to hide the spinner when the job has finished
app.printer.on('print-complete',function(evt){
$('.spin').spin('hide');
console.log('The url to the print image is : ' + evt.result.url);
});

```

```html
<!--add a div for your spinner-->
<div class="spin" data-spin ></div>

```
### [LiveSample](http://esri.github.io/developer-support/web-js/jQueryPrintSpinner/print1.html)
