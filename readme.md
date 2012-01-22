# JQuery-Data-Binding-Plugin

JQuery-Data-Binding-Plugin is a JQuery (https://github.com/jquery/jquery) plugin for bidirectional data binding between DOM elements and simple, JSON-like JavaScript objects. The purpose of this project is to allow working in a cleaner way in web forms by using a view-model (the JSON like objects) and automatically synchronize (via events) with the various bound DOM elemens (which are the views). This is a cleaner way because it allows decoupling DOM elements from each other by using observers. The model itself is completely unaware of the binding and nor is the DOM. The binding code is the only one knowing the binding, the model and the bound DOM elemens. This way, the plugin can be used with existing models and existing HTML, regardless of their source.

## Compatibility
This plugin was tested with JQuery versions 1.4.2, 1.4.3, 1.6.1 and 1.7.1. The minified version of JQuery 1.4.3, 1.6.1 and 1.7.1 are included here so that the tests and examples work.

## Source code
The human readable working source code is jquery.as24.bind.js.

## Minified version
jquery.as24.bind-1.3.2.min.js is the current minified version of the jquery.as24.bind.js. The minified version is done with the excellent Google Closure Compiler (http://code.google.com/closure/compiler/)

## How to use
You can use existing HTML, like a simple textbox and a label to see an echo of the typing in the text box:

```html
Name: <input id="name" value=""/><br/>
Echo:&nbsp;<label id="nameEcho">Here will be the echo...</label>
```

We can have an existing model in a the simple form of a JavaScript object with one property, called 'name'

```js
var myModel = {name:'Some value'};
```

Until now we do not have anything to do with the data binding plugin.
You need to include jQuery and this plugin before the code using the data binding:

```html
<script type="text/javascript"
 src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script> 
<script src="./jquery.as24.bind-1.3.2.min.js" type="text/javascript"></script>
```

Now, we can do the binding:

```js
// bind the model's 'name' attribute to the input textbox 
// identified by it's id (CSS selector '#name') 
// and react on DOM 'keyup' and 'change' events
// then bind again the model's 'name' attribute to the feedback 
// label named 'nameEcho'
$(myModel).dataBind({modelAttribute:'name', selector:'#name', eventToBind:'keyup change'})
	.dataBind({modelAttribute:'name', selector:'#nameEcho'});
```

From now on, changes to the text box reflect into the model and changes to the model reflect into the text box and the feedback label. So, if we change some value in the text box, the model will magically (actually via events) get the value of the text box and with the same magic the feedback/echo label will get the same value from the model.

We can also programatically set values in the model, by using the attr() method, which is intercepted, so that the model changes will propagate to the bound DOM elements:

```js
$(myModel).attr('name', 'A brand New Value');
```

Do not set dirrectly the fields of the model because this is not possible to intercept and the change is not propagated to the bound DOM elements.
You can read the model either with the attr() method or directly: 

```js
var x = $(myModel).attr('name');
var y = myModel.name;
var z = myModel['name'];
```

In the ./examples folder you can find the bindingExample.html file which contains some crammed together usage examples of the data binding.

## Validation

It is very easy to implement a clean validation with this plugin. We should validate the model, not the DOM element values. In order to implement trivial input validation you should have a second model, with the same fields as the main model. You bind the main model to the input elements and the validation model to the validation feedback (usually styled labels). You also need to react on changes to the main model in order to check it. Because this plugin uses events you can bind to 'change' event on the model or even fine grained, per field events like 'change.name': 

```js
$(myModel).on('change.name', function(event){
	if(event.newValue) $(validationModel).attr('name', '');
	else $(validationModel).attr('name', 'Please enter a value!');
});
```

## Tests
The ./tests folder contains the automatic tests/specs for the jquery.as24.bind.js and the needed testing framework jasmine (https://github.com/pivotal/jasmine).

## Licence
This project is released under a MIT licence, so in plain English, you are allowed to use it pretty much as you like.

