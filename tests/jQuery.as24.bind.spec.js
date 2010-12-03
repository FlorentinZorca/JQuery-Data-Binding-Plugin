describe("jquery.as24.bind (jQuery plugin)", function() {

var dummyTranslation = 'dummyValue';

var fakeTranslator = function(value){
	return dummyTranslation+value;
}

var reversedFakeTranslator = function(value){
	return (value!==undefined && value!==null)? value.replace(dummyTranslation, '') : value;
}

var numberToWordTranslator = function(value){
	if (typeof(value==='number'))value = value.toString(10);
	switch(value){
		case '0': return 'zero';
		case '1': return 'one';
		case '2': return 'two';
		case '3': return 'three';
		case '4': return 'four';
		default: return 'something unexpected';
	}
}

var wordToNumberTranslator = function(value){
	switch(value){
		case 'zero': return '0';
		case 'one': return '1';
		case 'two': return '2';
		case 'three': return '3';
		case 'four': return '4';
		default: return 'something unexpected';
	}
}

var arraysHaveTheSameElements = function(left, right){	
	var returnValue = false;
	if($.isArray(left) && $.isArray(right)){	
		returnValue = (left.length === right.length);
		left.sort(); // O(N*ln(N))
		right.sort(); // O(N*ln(N))
		$.each(left, function(i, elem){ // O(N)
			returnValue &= (right[i]===elem);
		});
		// 2*O(N*ln(N)) << O(N^2) for N>6 (but the arrays in these tests are small)
	}
	
	return returnValue;
}

var domValuesHaveTheSameElementsAsInArray = function(domSelector, referenceArray){	
	var domValues = [];
	$.each($(domSelector), function(i, elem){
		domValues[i] = elem.value;
	});
	return arraysHaveTheSameElements(domValues, referenceArray);
}

describe("getBindingType()", function(){
	var domId, domSelector, domElements;

	describe("text box", function(){
		beforeEach(function() {
			domId = 'someTextBox';
			domSelector = '#'+domId;
			$('body').append('<input type="text" id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'text'", function(){
			expect($().getBindingType(domSelector)).toEqual('text');
		});
	});

	describe("hidden field", function(){
		beforeEach(function() {
			domId = 'someHiddenField';
			domSelector = '#'+domId;
			$('body').append('<input type="hidden" id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'text'", function(){
			expect($().getBindingType(domSelector)).toEqual('text');
		});
	});

	describe("password field", function(){
		beforeEach(function() {
			domId = 'somePasswordField';
			domSelector = '#'+domId;
			$('body').append('<input type="password" id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'text'", function(){
			expect($().getBindingType(domSelector)).toEqual('text');
		});
	});
	
	describe("drop down (single select)", function(){
		beforeEach(function() {
			domId = 'someDropDown';
			domSelector = '#'+domId;
			$('body').append('<select id="'+domId+'"><option value="one" selected>One</option><option value="two">Two</option><option value="three">Three</option></select>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'dropdown'", function(){
			expect($().getBindingType(domSelector)).toEqual('dropdown');
		});
	});
	
	describe("multi select", function(){
		beforeEach(function() {
			domId = 'someMultiSelect';
			domSelector = '#'+domId;
			$('body').append('<select id="'+domId+'" multiple><option value="one" selected>One</option><option value="two">Two</option><option value="three">Three</option></select>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'multiselect'", function(){
			expect($().getBindingType(domSelector)).toEqual('multiselect');
		});
	});

	describe("check boxes", function(){
		beforeEach(function() {
			domId = 'someCheckBoxes';
			domSelector = 'input[name='+domId+']';
			$('body').append('<input type="checkbox" id="cb1" value="1" name="'+domId+'"/><input type="checkbox" id="cb2" value="2" name="'+domId+'" checked="checked"/><input type="checkbox" id="cb3" value="3" name="'+domId+'"/><input type="checkbox" id="cb4" value="4" name="'+domId+'" checked="checked"/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'checkbox'", function(){
			expect($().getBindingType(domSelector)).toEqual('checkbox');
		});
	});

	describe("radio buttons", function(){
		beforeEach(function() {
			domId = 'someCheckBoxes';
			domSelector = 'input[name='+domId+']';
			$('body').append('<input type="radio" id="rb1" value="1" name="'+domId+'"/><input type="radio" id="rb2" value="2" name="'+domId+'" checked="checked"/><input type="radio" id="rb3" value="3" name="'+domId+'"/><input type="radio" id="rb4" value="4" name="'+domId+'"/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'radio'", function(){
			expect($().getBindingType(domSelector)).toEqual('radio');
		});
	});	
	
	describe("button (as tag)", function(){
		beforeEach(function() {
			domId = 'someButton';
			domSelector = '#'+domId;
			$('body').append('<button id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'button'", function(){
			expect($().getBindingType(domSelector)).toEqual('button');
		});
	});

	describe("button (as input type)", function(){
		beforeEach(function() {
			domId = 'someButton';
			domSelector = '#'+domId;
			$('body').append('<input type="button" id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'button'", function(){
			expect($().getBindingType(domSelector)).toEqual('button');
		});
	});

	describe("reset button", function(){
		beforeEach(function() {
			domId = 'someButton';
			domSelector = '#'+domId;
			$('body').append('<input type="reset" id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'button'", function(){
			expect($().getBindingType(domSelector)).toEqual('button');
		});
	});

	describe("submit button", function(){
		beforeEach(function() {
			domId = 'someButton';
			domSelector = '#'+domId;
			$('body').append('<input type="submit" id="'+domId+'" value="Original text."/>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'button'", function(){
			expect($().getBindingType(domSelector)).toEqual('button');
		});
	});

	describe("something else (not a form element)", function(){
		beforeEach(function() {
			domId = 'somethingElse';
			domSelector = '#'+domId;
			$('body').append('<a id="'+domId+'" href="www.bing.com">Go Bing!</a>');
			domElements = $(domSelector);
		});

		afterEach(function() {
			domElements.remove();
		});
		
		it("should return 'property'", function(){
			expect($().getBindingType(domSelector)).toEqual('property');
		});
	});
	
});

describe("dataBind()",  function() {
	var model, domElement, boundField = 'someField';

	beforeEach(function() {
		model = {}; // start each test with a blank model
	});
	
	describe("for plain text",  function() {
		var initialValue = 'some text';
		var domId = 'someLabel';
		var domSelector = '#'+domId;

		beforeEach(function() {
			$('body').append('<label id="'+domId+'">Original text.</label>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.text()).toEqual(initialValue);
			});

			describe("when bound to a second DOM element", function(){
				var domAnotherId = 'anotherElement';
				var domAnotherSelector = '#'+domAnotherId;
				var domAnotherElement = null;
				beforeEach(function() {
					$('body').append('<div id="'+domAnotherId+'">Does not matter.</div>');
					domAnotherElement = $(domAnotherSelector);
					$(model).attr(boundField, initialValue);
					$(model).dataBind({modelAttribute:boundField, selector:domAnotherSelector});
				});
			
				afterEach(function() {
					domAnotherElement.remove();
				});
				
				it("should bring the data to the second DOM element", function(){
					expect(domAnotherElement.text()).toEqual(initialValue);
				});
				
				describe("when the model changes", function(){
					var newValue = 'yet another value';
					
					beforeEach(function(){
						$(model).attr(boundField, newValue);
					});

					it("should change the bound DOM element", function(){
						expect(domAnotherElement.text()).toEqual(newValue);
					});
				});	// when the model changes		
				
			}); // "when bound to a second DOM element"

		}); // "initial binding"

		describe("when the model changes", function(){
			var newValue = 'some other text';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});

			it("should change the bound DOM element", function(){
				expect(domElement.text()).toEqual(newValue);
			});
		});	// when the model changes		
	}); // for plain text

	describe("for pre-filled plain text",  function() {
		var initialValue = 'the initial value';
		var domId = 'someLabel';
		var domSelector = '#'+domId;

		beforeEach(function() {
			$('body').append('<label id="'+domId+'">'+initialValue+'</label>');
			domElement = $(domSelector);
			$(model).attr(boundField, 'something else');
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, initialDataInDom: true});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data from the bound DOM element to the model bound field", function(){
				expect($(model).attr(boundField)).toEqual(initialValue);
			});
		}); // "initial binding"

		describe("when the model changes", function(){
			var newValue = 'some other text';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});

			it("should change the bound DOM element", function(){
				expect(domElement.text()).toEqual(newValue);
			});
		});	// when the model changes		
	}); // for plain text
	
	describe("for plain text with translator function", function(){
		var initialValue = 'some text';
		var domId = 'someLabel';
		var domSelector = '#'+domId;
		var dummyTranslator;
		var dummyReversedTranslator;

		beforeEach(function() {
			$('body').append('<label id="'+domId+'">Original text.</label>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslator = jasmine.createSpy('translator').andCallFake(fakeTranslator);
			dummyReversedTranslator = jasmine.createSpy('translator').andCallFake(reversedFakeTranslator);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslator, translateFrom: dummyReversedTranslator});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should call the given translator to function", function(){
				expect(dummyTranslator).toHaveBeenCalled();
			});
		
			it("should call the given translator to function with the model value as argument", function(){
				expect(dummyTranslator).toHaveBeenCalledWith(initialValue);
			});

			it("should call the given translator from function", function(){
				expect(dummyReversedTranslator).toHaveBeenCalled();
			});
		
			it("should call the given translator from function with the tranlsated value as argument", function(){
				expect(dummyReversedTranslator).toHaveBeenCalledWith(fakeTranslator(initialValue));
			});
		
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.text()).toEqual(fakeTranslator(initialValue));
			});
		}); // "initial binding"

		describe("when the model changes", function(){
			var newValue = 'some other text';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
		
			it("should call the given translator function with the new model value as argument", function(){
				expect(dummyTranslator).toHaveBeenCalledWith(newValue);
			});

			it("should change the bound DOM element", function(){
				expect(domElement.text()).toEqual(fakeTranslator(newValue));
			});
		});	// when the model changes		
	}); // bindToPlainText() with translation function
		
	describe("for text boxes",  function() {
		var initialValue = 'some text';
		var domId = 'someTextBox';
		var domSelector = '#'+domId;

		beforeEach(function() {
			$('body').append('<input type="text" id="'+domId+'" value="Original text."/>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.val()).toEqual(initialValue);
			});
		}); // "initial binding"
		
		describe("when the model changes", function(){
			var newValue = 'some other text';

			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(newValue);
			});		
		});	// when the model changes

		describe("when DOM value changes", function() {	
			var newValue = "yet another value";
		
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should fill the model with the new value from the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(newValue);
			});
		}); // when DOM value changes						
	}); // for text boxes
		
	describe("for text boxes reacting on key press",  function() {
		var initialValue = 'some text';
		var domId = 'someTextBox';
		var domSelector = '#'+domId;

		beforeEach(function() {
			$('body').append('<input type="text" id="'+domId+'" value="Original text."/>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, eventToBind:'keypress'});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.val()).toEqual(initialValue);
			});
		}); // "initial binding"
		
		describe("when the model changes", function(){
			var newValue = 'some other text';

			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(newValue);
			});		
		});	// when the model changes

		describe("when DOM value changes", function() {	
			var newValue = "yet another value";
		
			beforeEach(function(){
				domElement.val(newValue);
				domElement.keypress(); // simulate the manual change
			});
		
			it("should fill the model with the new value from the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(newValue);
			});
		}); // when DOM value changes						
	}); // for text boxes reacting on key press
		
	describe("for pre-filled text boxes",  function() {
		var initialValue = 'some text';
		var domId = 'someTextBox';
		var domSelector = '#'+domId;

		beforeEach(function() {
			$('body').append('<input type="text" id="'+domId+'" value="'+initialValue+'"/>');
			domElement = $(domSelector);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, initialDataInDom:true});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the model", function(){
				expect($(model).attr(boundField)).toEqual(initialValue);
			});
		}); // "initial binding"

		describe("when DOM value changes", function() {	
			var newValue = "yet another value";
		
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should fill the model with the new value from the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(newValue);
			});
		}); // when DOM value changes						
		
		describe("when the model changes", function(){
			var newValue = 'some other text';

			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(newValue);
			});		
		});	// when the model changes
	}); // for text boxes
	
	describe("for text boxes with translator functions",  function() {
		var initialValue = 'some text';
		var domId = 'someTextBox';
		var domSelector = '#'+domId;
		var dummyTranslatorModelToDom;
		var dummyTranslatorDomToModel;

		beforeEach(function() {
			$('body').append('<input type="text" id="'+domId+'" value="Original text."/>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslatorModelToDom = jasmine.createSpy('model2dom').andCallFake(fakeTranslator);
			dummyTranslatorDomToModel = jasmine.createSpy('dom2model').andCallFake(reversedFakeTranslator);
			// WARNING: the 2 translator functions must be opposite f(g(x))=x=g(f(x)) 
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslatorModelToDom, translateFrom: dummyTranslatorDomToModel});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue);
			});
		
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.val()).toEqual(fakeTranslator(initialValue));
			});
		}); // "initial binding"

		describe("when the model changes", function(){
			var newValue = 'some other text';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
		
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the new model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(newValue);
			});

			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(fakeTranslator(newValue));
			});
		});	// when the model changes

		describe("when the DOM element changes", function(){
			var newValue = "yet another value";
		
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should call the given translator function", function(){
				expect(dummyTranslatorDomToModel).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the new model value as argument", function(){
				expect(dummyTranslatorDomToModel).toHaveBeenCalledWith(newValue);
			});

			it("should change the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(reversedFakeTranslator(newValue));
			});
		});	// when the DOM element changes
	}); // for text boxes with translator functions

	describe("for drop downs (single select)", function(){
		var boundField = 'someField';
		var valueOne = '1';
		var valueTwo = '2';
		var valueThree = '3';
		var initialValue = valueTwo;
		var domId = 'someDropDown';
		var domSelector = '#'+domId;
		var domElement = null;

		beforeEach(function() {
			$('body').append('<select id="'+domId+'"><option value="'+valueOne+'" selected>'+numberToWordTranslator(valueOne)+'</option><option value="'+valueTwo+'">'+numberToWordTranslator(valueTwo)+'</option><option value="'+valueThree+'">'+numberToWordTranslator(valueThree)+'</option></select>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.val()).toEqual(initialValue);
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue;

			beforeEach(function(){
				newValue = valueThree
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(newValue);
			});
		});	// when the model changes
		
		describe("when DOM value changes", function() {
			var newValue;
		
			beforeEach(function(){
				newValue = valueOne;
				domElement.val(newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should fill the model with the new value from the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(newValue);
			});
		}); // when DOM value changes
	}); // for drop downs (single select)

	describe("for pre-filled drop downs (single select)", function(){
		var boundField = 'someField';
		var valueOne = '1';
		var valueTwo = '2';
		var valueThree = '3';
		var initialValue = valueTwo;
		var domId = 'someDropDown';
		var domSelector = '#'+domId;
		var domElement = null;

		beforeEach(function() {
			$('body').append('<select id="'+domId+'"><option value="'+valueOne+'" selected>'+numberToWordTranslator(valueOne)+'</option><option value="'+valueTwo+'">'+numberToWordTranslator(valueTwo)+'</option><option value="'+valueThree+'">'+numberToWordTranslator(valueThree)+'</option></select>');
			domElement = $(domSelector);
			domElement.val(initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, initialDataInDom:true});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the DOM data to the bound field", function(){
				expect($(model).attr(boundField)).toEqual(initialValue);
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue;

			beforeEach(function(){
				newValue = valueThree
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(newValue);
			});
		});	// when the model changes
		
		describe("when DOM value changes", function() {
			var newValue;
		
			beforeEach(function(){
				newValue = valueOne;
				domElement.val(newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should fill the model with the new value from the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(newValue);
			});
		}); // when DOM value changes
	}); // for pre-filled drop downs (single select)

	describe("for drop downs (single select) with translator functions", function(){
		var boundField = 'someField';
		var valueOne = '1';
		var valueTwo = '2';
		var valueThree = '3';
		var initialValue = numberToWordTranslator(valueTwo); //'two' text
		var domId = 'someDropDown';
		var domSelector = '#'+domId;
		var domElement = null;
		var dummyTranslatorModelToDom;
		var dummyTranslatorDomToModel;

		beforeEach(function() {
			$('body').append('<select id="'+domId+'"><option value="'+valueOne+'" selected>'+numberToWordTranslator(valueOne)+'</option><option value="'+valueTwo+'">'+numberToWordTranslator(valueTwo)+'</option><option value="'+valueThree+'">'+numberToWordTranslator(valueThree)+'</option></select>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslatorModelToDom = jasmine.createSpy('model2dom').andCallFake(wordToNumberTranslator);
			dummyTranslatorDomToModel = jasmine.createSpy('dom2model').andCallFake(numberToWordTranslator);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslatorModelToDom, translateFrom: dummyTranslatorDomToModel});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue);
			});
		
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.val()).toEqual(wordToNumberTranslator(initialValue));
			});
		}); // "initial binding"

		describe("when the model changes", function(){
			var newValue = numberToWordTranslator(valueThree) //'three' text
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
		
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the new model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(newValue);
			});

			it("should change the bound DOM element", function(){
				expect(domElement.val()).toEqual(wordToNumberTranslator(newValue));
			});
		});	// when the model changes

		describe("when the DOM element changes", function(){
			var newValue = valueOne;
		
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should call the given translator function", function(){
				expect(dummyTranslatorDomToModel).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the new model value as argument", function(){
				expect(dummyTranslatorDomToModel).toHaveBeenCalledWith(newValue);
			});

			it("should change the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(numberToWordTranslator(newValue)); // 'one' text
			});
		});	// when the DOM element changes		
	}); // for drop downs (single select) with translator functions
	
	describe("for check boxes",  function() {
		var boundField = 'someField';
		var initialValue = '1,2';
		var domElementName = "somecheckboxname";
		var domSelector = "input[name="+domElementName+"]";
		var domElements = null;

		beforeEach(function() {
			$('body').append('<input type="checkbox" id="cb1" value="1" name="'+domElementName+'"/><input type="checkbox" id="cb2" value="2" name="'+domElementName+'" checked="checked"/><input type="checkbox" id="cb3" value="3" name="'+domElementName+'"/><input type="checkbox" id="cb4" value="4" name="'+domElementName+'" checked="checked"/>');
			domElements = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector});
		});

		afterEach(function() {
			domElements.remove();
		});
		
		describe("initial binding", function(){
			it("should fill the bound DOM elements according to model values", function(){	
				expect(domValuesHaveTheSameElementsAsInArray(domSelector+':checked', initialValue.split(','))).toBeTruthy();
			});
		}); // initial binding	
		
		describe("when changing the model", function(){		
			var newValue = '2,3,4';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should set check/uncheck the bound DOM checkboxes accordingly", function(){
				expect(domValuesHaveTheSameElementsAsInArray(domSelector+':checked', newValue.split(','))).toBeTruthy();
			});
		}); // when changing the model
		
		describe("when checking value 1 checkbox", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", true);
				$(domSelector+"[value=1]").change();
			});
			it("should have the value 1 in the model value", function(){
				expect($.inArray('1', $(model).attr(boundField).split(','))).toBeGreaterThan(-1);
			});
		}); // when checking value 1 checkbox

		describe("when unchecking value 1 checkbox", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", false);
				$(domSelector+"[value=1]").change();
			});
			it("should not have the value 1 in the model value", function(){
				expect($.inArray('1', $(model).attr(boundField).split(','))).toBeLessThan(0);
			});
		}); // when unchecking value 1 checkbox
	}); // for check boxes
	
	describe("for pre-filled check boxes",  function() {
		var boundField = 'someField';
		var initialValue = '1,2';
		var domElementName = "somecheckboxname";
		var domSelector = "input[name="+domElementName+"]";
		var domElements = null;

		beforeEach(function() {
			$('body').append('<input type="checkbox" id="cb1" value="1" name="'+domElementName+'"/><input type="checkbox" id="cb2" value="2" name="'+domElementName+'" checked="checked"/><input type="checkbox" id="cb3" value="3" name="'+domElementName+'"/><input type="checkbox" id="cb4" value="4" name="'+domElementName+'" checked="checked"/>');
			domElements = $(domSelector);
			domElements.val(initialValue.split(','));
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, initialDataInDom:true});
		});

		afterEach(function() {
			domElements.remove();
		});
		
		describe("initial binding", function(){
			it("should fill the bound DOM elements according to model values", function(){	
				expect(domValuesHaveTheSameElementsAsInArray(domSelector+':checked', $(model).attr(boundField).split(','))).toBeTruthy();
			});
		}); // initial binding	
		
		describe("when changing the model", function(){		
			var newValue = '2,3,4';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should set check/uncheck the bound DOM checkboxes accordingly", function(){
				expect(domValuesHaveTheSameElementsAsInArray(domSelector+':checked', newValue.split(','))).toBeTruthy();
			});
		}); // when changing the model
		
		describe("when checking value 1 checkbox", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", true);
				$(domSelector+"[value=1]").change();
			});
			it("should have the value 1 in the model value", function(){
				expect($.inArray('1', $(model).attr(boundField).split(','))).toBeGreaterThan(-1);
			});
		}); // when checking value 1 checkbox

		describe("when unchecking value 1 checkbox", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", false);
				$(domSelector+"[value=1]").change();
			});
			it("should not have the value 1 in the model value", function(){
				expect($.inArray('1', $(model).attr(boundField).split(','))).toBeLessThan(0);
			});
		}); // when unchecking value 1 checkbox
	}); // for pre-filled check boxes

	describe("for check boxes with translator functions",  function() {
		var boundField = 'someField';
		var initialValue = 'one,two';
		var domElementName = "somecheckboxname";
		var domSelector = "input[name="+domElementName+"]";
		var domElements = null;
		var dummyTranslatorModelToDom;
		var dummyTranslatorDomToModel;

		beforeEach(function() {
			$('body').append('<input type="checkbox" id="cb1" value="1" name="'+domElementName+'"/><input type="checkbox" id="cb2" value="2" name="'+domElementName+'" checked="checked"/><input type="checkbox" id="cb3" value="3" name="'+domElementName+'"/><input type="checkbox" id="cb4" value="4" name="'+domElementName+'" checked="checked"/>');
			domElements = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslatorModelToDom = jasmine.createSpy('model2dom').andCallFake(wordToNumberTranslator);
			dummyTranslatorDomToModel = jasmine.createSpy('dom2model').andCallFake(numberToWordTranslator);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslatorModelToDom, translateFrom: dummyTranslatorDomToModel});
		});

		afterEach(function() {
			domElements.remove();
		});
		
		describe("initial binding", function(){
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model values as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue.split(',')[0]);
			});

			it("should fill the bound DOM elements according to model values", function(){	
				var reference = [];
				$.each(initialValue.split(','), function(i, n) {reference[i] = wordToNumberTranslator(n);} );
				expect(domValuesHaveTheSameElementsAsInArray(domSelector+':checked', reference)).toBeTruthy();
			});
		}); // initial binding	
		
		describe("when changing the model", function(){		
			var newValue = 'two,three,four';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});

			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(newValue.split(',')[2]);
			});
			
			it("should set check/uncheck the bound DOM checkboxes accordingly", function(){
				var reference = [];
				$.each(newValue.split(','), function(i, n) {reference[i] = wordToNumberTranslator(n);} );
				expect(domValuesHaveTheSameElementsAsInArray(domSelector+':checked', reference)).toBeTruthy();
			});
		}); // when changing the model
		
		describe("when checking value 1 checkbox", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", true);
				$(domSelector+"[value=1]").change();
			});
			it("should have the value 1 in the model value", function(){
				expect($.inArray(numberToWordTranslator('1'), $(model).attr(boundField).split(','))).toBeGreaterThan(-1);
			});
		}); // when checking value 1 checkbox

		describe("when unchecking value 1 checkbox", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", false);
				$(domSelector+"[value=1]").change();
			});
			it("should not have the value 1 in the model value", function(){
				expect($.inArray(numberToWordTranslator('1'), $(model).attr(boundField).split(','))).toBeLessThan(0);
			});
		}); // when unchecking value 1 checkbox
	}); // for check boxes with translator functions

	describe("for radio buttons",  function() {
		var boundField = 'someField';
		var initialValue = '2';
		var domElementName = "someradio";
		var domSelector = "input[name="+domElementName+"]";
		var domElements = null;

		beforeEach(function() {
			$('body').append('<input type="radio" id="r1" value="1" name="'+domElementName+'"/><input type="radio" id="r2" value="2" name="'+domElementName+'" checked="checked"/><input type="radio" id="r3" value="3" name="'+domElementName+'"/>');
			domElements = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector});
		});

		afterEach(function() {
			domElements.remove();
		});
		
		describe("initial binding", function(){
			it("should check radio button with the model value", function(){	
				expect($(domSelector+"[value="+initialValue+"]").attr("checked")).toBeTruthy();
			});
			
			it("should uncheck radio buttons with other values", function(){	
				expect($(domSelector+"[value!="+initialValue+"]:checked").length).toEqual(0);
			});
			
			it("should check/uncheck the bound DOM radio elements according to model values", function(){	
				expect($(domSelector+":checked").val()).toEqual(initialValue);
			});
		}); // initial binding	
		
		describe("when changing the model", function(){		
			var newValue = '3';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should set check/uncheck the bound DOM radio accordingly", function(){
				expect($(domSelector+":checked").val()).toEqual(newValue);
			});
		}); // when changing the model
		
		describe("when checking value 1 radio button", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", true);
				$(domSelector+"[value=1]").change();
			});
			it("should have the value 1 in the model value", function(){
				expect($(model).attr(boundField)).toEqual('1');
			});
		}); // when checking value 1 radio button
	}); // for radio buttons

	describe("for pre-filled radio buttons",  function() {
		var boundField = 'someField';
		var initialValue = '2';
		var domElementName = "someradio";
		var domSelector = "input[name="+domElementName+"]";
		var domElements = null;

		beforeEach(function() {
			$('body').append('<input type="radio" id="r1" value="1" name="'+domElementName+'"/><input type="radio" id="r2" value="2" name="'+domElementName+'" checked="checked"/><input type="radio" id="r3" value="3" name="'+domElementName+'"/>');
			domElements = $(domSelector);
			$(domSelector+'[value!='+initialValue+']').attr("checked", false);
			$(domSelector+'[value='+initialValue+']').attr("checked", true);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, initialDataInDom:true});
		});

		afterEach(function() {
			domElements.remove();
		});
		
		describe("initial binding", function(){
			it("bring the DOM data to the bound field", function(){	
				expect($(model).attr(boundField)).toEqual(initialValue);
			});
		}); // initial binding	
		
		describe("when changing the model", function(){		
			var newValue = '3';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should set check/uncheck the bound DOM radio accordingly", function(){
				expect($(domSelector+":checked").val()).toEqual(newValue);
			});
		}); // when changing the model
		
		describe("when checking value 1 radio button", function(){
			beforeEach(function(){
				$(domSelector+"[value=1]").attr("checked", true);
				$(domSelector+"[value=1]").change();
			});
			it("should have the value 1 in the model value", function(){
				expect($(model).attr(boundField)).toEqual('1');
			});
		}); // when checking value 1 radio button
	}); // for pre-filled radio buttons

	describe("for radio buttons with translator functions",  function() {
		var boundField = 'someField';
		var initialValue = 'two';
		var domElementName = "someradio";
		var domSelector = "input[name="+domElementName+"]";
		var domElements = null;
		var dummyTranslatorModelToDom;
		var dummyTranslatorDomToModel;

		beforeEach(function() {
			$('body').append('<input type="radio" id="r1" value="1" name="'+domElementName+'"/><input type="radio" id="r2" value="2" name="'+domElementName+'" checked="checked"/><input type="radio" id="r3" value="3" name="'+domElementName+'"/>');
			domElements = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslatorModelToDom = jasmine.createSpy('model2dom').andCallFake(wordToNumberTranslator);
			dummyTranslatorDomToModel = jasmine.createSpy('dom2model').andCallFake(numberToWordTranslator);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslatorModelToDom, translateFrom: dummyTranslatorDomToModel});
		});

		afterEach(function() {
			domElements.remove();
		});
		
		describe("initial binding", function(){
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model values as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue.split(',')[0]);
			});

			it("should check radio button with the model value", function(){	
				expect($(domSelector+"[value="+wordToNumberTranslator(initialValue)+"]").attr("checked")).toBeTruthy();
			});
			
			it("should uncheck radio buttons with other values", function(){	
				expect($(domSelector+"[value!="+wordToNumberTranslator(initialValue)+"]:checked").length).toEqual(0);
			});
			
			it("should check/uncheck the bound DOM radio elements according to model values", function(){	
				expect($(domSelector+":checked").val()).toEqual(wordToNumberTranslator(initialValue));
			});
		}); // initial binding	
		
		describe("when changing the model", function(){		
			var newValue = 'three';
			
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});

			it("should call the given translator function with the model values as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(newValue);
			});
			
			it("should set check/uncheck the bound DOM radio accordingly", function(){
				expect($(domSelector+":checked").val()).toEqual(wordToNumberTranslator(newValue));
			});
		}); // when changing the model
		
		describe("when checking value 1 radio button", function(){
			var newValue = '1';
		
			beforeEach(function(){
				$(domSelector+'[value='+newValue+']').attr("checked", true);
				$(domSelector+'[value='+newValue+']').change();
			});

			it("should call the given translator function with the 1 value as argument", function(){
				expect(dummyTranslatorDomToModel).toHaveBeenCalledWith(newValue);
			});
			
			it("should have the value 1 in the model value", function(){
				expect($(model).attr(boundField)).toEqual(numberToWordTranslator(newValue));
			});
		}); // when checking value 1 radio button
	}); // for radio buttons with translator functions
	
	describe("for multi select",  function() {
		var boundField = 'someField';
		var valueOne = '1';
		var valueTwo = '2';
		var valueThree = '3';
		var valueFour = '4';
		var initialValue = valueTwo+','+valueThree;
		var domId = 'someDropDown';
		var domSelector = '#'+domId;
		var domElement = null;

		beforeEach(function() {
			$('body').append('<select id="'+domId+'" multiple="multiple" size="4"><option value="'+valueOne+'" selected>'+numberToWordTranslator(valueOne)+'</option><option value="'+valueTwo+'">'+numberToWordTranslator(valueTwo)+'</option><option value="'+valueThree+'">'+numberToWordTranslator(valueThree)+'</option><option value="'+valueFour+'" selected>'+numberToWordTranslator(valueFour)+'</option></select>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(arraysHaveTheSameElements(domElement.val(), initialValue.split(','))).toBeTruthy();
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue = valueThree+','+valueFour;
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(arraysHaveTheSameElements(domElement.val(), newValue.split(','))).toBeTruthy();
			});
		});	// when the model changes

		describe("when the linked DOM element changes", function(){
			var newValue = [valueOne, valueTwo, valueThree];
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change();
			});
			
			it("should change the model", function(){
				expect(arraysHaveTheSameElements($(model).attr(boundField).split(','), newValue)).toBeTruthy();
			});
		});	// when the bound DOM element changes
	}); // for multi select
	
	describe("for pre-filled multi select",  function() {
		var boundField = 'someField';
		var valueOne = '1';
		var valueTwo = '2';
		var valueThree = '3';
		var valueFour = '4';
		var initialValue = valueTwo+','+valueThree;
		var domId = 'someDropDown';
		var domSelector = '#'+domId;
		var domElement = null;

		beforeEach(function() {
			$('body').append('<select id="'+domId+'" multiple="multiple" size="4"><option value="'+valueOne+'" selected>'+numberToWordTranslator(valueOne)+'</option><option value="'+valueTwo+'">'+numberToWordTranslator(valueTwo)+'</option><option value="'+valueThree+'">'+numberToWordTranslator(valueThree)+'</option><option value="'+valueFour+'" selected>'+numberToWordTranslator(valueFour)+'</option></select>');
			domElement = $(domSelector);
			domElement.val(initialValue.split(','));
			model = {};
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, initialDataInDom:true});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(arraysHaveTheSameElements($(model).attr(boundField).split(','), initialValue.split(','))).toBeTruthy();
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue = valueThree+','+valueFour;
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(arraysHaveTheSameElements(domElement.val(), newValue.split(','))).toBeTruthy();
			});
		});	// when the model changes

		describe("when the linked DOM element changes", function(){
			var newValue = [valueOne, valueTwo, valueThree];
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change();
			});
			
			it("should change the model", function(){
				expect(arraysHaveTheSameElements($(model).attr(boundField).split(','), newValue)).toBeTruthy();
			});
		});	// when the bound DOM element changes
	}); // for pre-filled multi select
	
	describe("for multi select with translator functions",  function() {
		var boundField = 'someField';
		var valueOne = '1';
		var valueTwo = '2';
		var valueThree = '3';
		var valueFour = '4';
		var initialValue = numberToWordTranslator(valueTwo)+','+numberToWordTranslator(valueThree);//'two,three';
		var domId = 'someDropDown';
		var domSelector = '#'+domId;
		var domElement = null;

		beforeEach(function() {
			$('body').append('<select id="'+domId+'" multiple="multiple" size="4"><option value="'+valueOne+'" selected>'+numberToWordTranslator(valueOne)+'</option><option value="'+valueTwo+'">'+numberToWordTranslator(valueTwo)+'</option><option value="'+valueThree+'">'+numberToWordTranslator(valueThree)+'</option><option value="'+valueFour+'" selected>'+numberToWordTranslator(valueFour)+'</option></select>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslatorModelToDom = jasmine.createSpy('model2dom').andCallFake(wordToNumberTranslator);
			dummyTranslatorDomToModel = jasmine.createSpy('dom2model').andCallFake(numberToWordTranslator);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslatorModelToDom, translateFrom: dummyTranslatorDomToModel});
		});

		afterEach(function() {
			domElement.remove();
		});

		describe("initial binding", function(){
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue.split(',')[0]);
			});
		
			it("should bring the data to the bound DOM element", function(){
				var reference = [];
				$.each(initialValue.split(','), function(i, n) {reference[i] = wordToNumberTranslator(n);} );			
				expect(arraysHaveTheSameElements(domElement.val(), reference)).toBeTruthy();
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue = numberToWordTranslator(valueThree)+','+numberToWordTranslator(valueFour); //'three,four';
			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				var reference = [];
				$.each(newValue.split(','), function(i, n) {reference[i] = wordToNumberTranslator(n);} );			
				expect(arraysHaveTheSameElements(domElement.val(), reference)).toBeTruthy();
			});
		});	// when the model changes

		describe("when the linked DOM element changes", function(){
			var newValue = [valueOne, valueTwo, valueThree];
			beforeEach(function(){
				domElement.val(newValue);
				domElement.change();
			});
			
			it("should change the model", function(){
				var reference = [];
				$.each(newValue, function(i, n) {reference[i] = numberToWordTranslator(n);} );			
				expect(arraysHaveTheSameElements($(model).attr(boundField).split(','), reference)).toBeTruthy();
			});
		});	// when the bound DOM element changes
	}); // for multi select with translator functions

	describe("for buttons",  function() {	
		var boundField = 'someField';
		var initialModelValue = 'someModelValue';
		var initialDomElementValue = 'someDomValue';
		var domId = 'someButton';
		var domSelector = '#'+domId;
		var domElement;
		
		describe("initial binding of button (as tag)", function(){
			beforeEach(function() {
				$('body').append('<button id="'+domId+'" value="'+initialDomElementValue+'"/>');
				$(model).attr(boundField, initialModelValue);
				$(model).dataBind({modelAttribute:boundField, selector:domSelector});
				domElement = $(domSelector);
			});

			afterEach(function() {
				domElement.remove();
			});
			
			it("should leave the model property unchanged", function(){
				expect($(model).attr(boundField)).toEqual(initialModelValue);
			});
			
			describe("when button clicked", function(){
				beforeEach(function() {
					domElement.click();
				});
				
				it("should set the model property to the DOM element value", function(){
					expect($(model).attr(boundField)).toEqual(initialDomElementValue);
				});
			}); // when button clicked
		}); // initial binding of button (as tag)

		describe("initial binding of button (as input type)", function(){
			beforeEach(function() {
				$('body').append('<input type="button" id="'+domId+'" value="'+initialDomElementValue+'"/>');
				$(model).attr(boundField, initialModelValue);
				$(model).dataBind({modelAttribute:boundField, selector:domSelector});
				domElement = $(domSelector);
			});

			afterEach(function() {
				domElement.remove();
			});
			
			it("should leave the model property unchanged", function(){
				expect($(model).attr(boundField)).toEqual(initialModelValue);
			});
			
			describe("when button clicked", function(){
				beforeEach(function() {
					domElement.click();
				});
				
				it("should set the model property to the DOM element value", function(){
					expect($(model).attr(boundField)).toEqual(initialDomElementValue);
				});
			}); // when button clicked
		}); // initial binding of button (as input type)

		describe("initial binding of reset button", function(){
			beforeEach(function() {
				$('body').append('<input type="reset" id="'+domId+'" value="'+initialDomElementValue+'"/>');
				$(model).attr(boundField, initialModelValue);
				$(model).dataBind({modelAttribute:boundField, selector:domSelector});
				domElement = $(domSelector);
			});

			afterEach(function() {
				domElement.remove();
			});
			
			it("should leave the model property unchanged", function(){
				expect($(model).attr(boundField)).toEqual(initialModelValue);
			});
			
			describe("when button clicked", function(){
				beforeEach(function() {
					domElement.click();
				});
				
				it("should set the model property to the DOM element value", function(){
					expect($(model).attr(boundField)).toEqual(initialDomElementValue);
				});
			}); // when button clicked
		}); // initial binding of reset button

		describe("initial binding of submit button", function(){
			beforeEach(function() {
				$('body').append('<input type="submit" id="'+domId+'" value="'+initialDomElementValue+'"/>');
				$(model).attr(boundField, initialModelValue);
				$(model).dataBind({modelAttribute:boundField, selector:domSelector});
				domElement = $(domSelector);
			});

			afterEach(function() {
				domElement.remove();
			});
			
			it("should leave the model property unchanged", function(){
				expect($(model).attr(boundField)).toEqual(initialModelValue);
			});
			
			describe("when button clicked", function(){
				beforeEach(function() {
					domElement.click();
				});
				
				it("should set the model property to the DOM element value", function(){
					expect($(model).attr(boundField)).toEqual(initialDomElementValue);
				});
			}); // when button clicked
		}); // initial binding of submit button
	}); // for buttons
	
	describe("for other properties of DOM elements",  function() {
		var boundField = 'someField';
		var initialValue = 'someValue';
		var domId = 'someTextBox';
		var domSelector = '#'+domId;
		var domElement = null;
		var domProperty = 'class';

		beforeEach(function() {
			$('body').append('<input type="text" id="'+domId+'" value="Original text."/>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, domProperty:domProperty});
		});

		afterEach(function() {
			domElement.remove();
		});
		
		describe("initial binding", function(){
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.attr(domProperty)).toEqual(initialValue);
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue = 'someNewValue';

			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
			
			it("should change the bound DOM element", function(){
				expect(domElement.attr(domProperty)).toEqual(newValue);
			});
			
		});	// when the model changes
		
		describe("when DOM value changes", function() {
			var newValue = "yaValue";
		
			beforeEach(function(){
				domElement.attr(domProperty, newValue);
				domElement.change(); // simulate the manual change
			});
		
			it("should fill the model with the new value from the bound DOM element", function(){
				expect($(model).attr(boundField)).toEqual(newValue);
			});
		}); // when DOM value changes
	}); // for other properties of DOM elements
	
	describe("for other properties of DOM elements with translator functions",  function() {
		var boundField = 'someField';
		var initialValue = 'someValue';
		var domId = 'someTextBox';
		var domSelector = '#'+domId;
		var domElement = null;
		var domProperty = 'class';
		var dummyTranslatorModelToDom;
		var dummyTranslatorDomToModel;

		beforeEach(function() {
			$('body').append('<div id="'+domId+'"/>');
			domElement = $(domSelector);
			$(model).attr(boundField, initialValue);
			dummyTranslatorModelToDom = jasmine.createSpy('model2dom').andCallFake(fakeTranslator);
			dummyTranslatorDomToModel = jasmine.createSpy('model2dom').andCallFake(reversedFakeTranslator);
			$(model).dataBind({modelAttribute:boundField, selector:domSelector, translateTo: dummyTranslatorModelToDom, translateFrom: dummyTranslatorDomToModel, domProperty:domProperty});
		});

		afterEach(function() {
			domElement.remove();
		});
		
		describe("initial binding", function(){
			it("should call the given translator function", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalled();
			});
		
			it("should call the given translator function with the model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue);
			});
		
			it("should bring the data to the bound DOM element", function(){
				expect(domElement.attr(domProperty)).toEqual(fakeTranslator(initialValue));
			});
		}); // initial binding

		describe("when the model changes", function(){
			var newValue = 'someNewValue';

			beforeEach(function(){
				$(model).attr(boundField, newValue);
			});
		
			it("should call the given translator function with the model value as argument", function(){
				expect(dummyTranslatorModelToDom).toHaveBeenCalledWith(initialValue);
			});
		
			it("should change the bound DOM element", function(){
				expect(domElement.attr(domProperty)).toEqual(fakeTranslator(newValue));
			});
		});	// when the model changes
	}); // for other properties of DOM elements with translator functions
	
}); // dataBind()

}); // END of Spec
