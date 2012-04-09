/*
* jQuery data binding plugin.
* Author: Florentin Zorca
*/
(function($) {

    var eventNamePrefix = 'change.';
    var oldattr = $.attr;

    // overriden JQuery $.attr() function which raises events when properties are set to plain objects.
    $.attr = function(elem, name, value, pass) {
        var ret = this,
        isModel = $.isPlainObject(elem), 
		oldValue;
        if (value === undefined) {
            ret = isModel ? elem[name] : oldattr(elem, name, value, pass);
        }
        else {
            if (isModel) {
                oldValue = elem[name];
                elem[name] = value;
                $(elem).trigger({ type: eventNamePrefix + name, attribute: name, newValue: value, oldValue: oldValue }); // the event for the current attribute change
                $(elem).trigger({ type: 'change', attribute: name, newValue: value, oldValue: oldValue }); // one event for all changes of the whole object
            }
            else {
                oldattr(elem, name, value, pass); // for the rest, just call the overriden attr function
            }
        }
        return ret;
    }

    var getBindingType = function(selector) {
        var elem;
        var elements = $(selector);

        if (elements.length > 0) {
            elem = elements[0];

            switch (elem.nodeName) {
                case 'INPUT':
                    switch (elem.type) {
                        case 'button':
						case 'radio':
						case 'checkbox':
                            return elem.type;
                        case 'reset':
                        case 'submit':
                            return 'button'
						default:
							return 'text';
                    }
                case 'SELECT':
                    if (elem.multiple) return 'multiselect';
                    else return 'dropdown';
                case 'BUTTON':
                    return 'button';
                case 'TEXTAREA':
                    return 'text';
            }
			return 'property';
        }
        return null;
    }

    // binds the model's 'change.'+modelAttribute event to the given updateView event handler
    var bindToView = function(model, modelAttribute, updateView) {
        updateView(); // update it now
        $(model).bind(eventNamePrefix + modelAttribute, updateView);
        // update it with each change
        return model;
    }

    var bindToProperty = function(model, modelAttribute, selector, domProperty, translate) {
        var updateView = function() {
            var value = $(model).attr(modelAttribute);
            if (translate !== undefined) {
                value = translate(value);
            }
            var domElement = (typeof (selector) === 'function') ? selector(value) : $(selector);
            switch (domProperty) {
                case undefined:
                case 'val':
                    domElement.val(value);
                    break;
                case 'text':
                    domElement.text(value);
                    break;
                default:
                    domElement.attr(domProperty, value);
            }
        }
        return bindToView(model, modelAttribute, updateView);
    }

    var bindToRadio = function(model, modelAttribute, selector, translate) {
        var updateView = function() {
            var value = $(model).attr(modelAttribute);
            if (translate !== undefined) value = translate(value);
            $(selector).attr("checked", false);
            $(selector).filter("[value='" + value + "']").attr("checked", true);
        }
        return bindToView(model, modelAttribute, updateView);
    }

    var bindToMoreVals = function(model, modelAttribute, selector, setter) {
        if (setter === undefined) {
            setter = function(values) {
                $(selector).val(values);
            }
        }
        var updateView = function() {
            // fill the view with the all model field values
            // TODO: work directly with the array
            var values = $(model).attr(modelAttribute).split(',');
            setter(values);
        }
        return bindToView(model, modelAttribute, updateView);
    }

    var bindToCheckBox = function(model, modelAttribute, selector, translate) {
        return bindToMoreVals(model, modelAttribute, selector, function(values) {
            $(selector).attr("checked", false);
            $.each(values, function(i, elem) {
                if (translate !== undefined) elem = translate(elem);
                $(selector).filter("[value='" + elem + "']").attr("checked", true);
            });
        });
    }

    var bindToMultiSelect = function(model, modelAttribute, selector, translate) {
        return bindToMoreVals(model, modelAttribute, selector, function(values) {
            var vals = values;
            if (translate !== undefined)
                for (i = 0; i < values.length; i++) values[i] = translate(values[i]);
            $(selector).val(values);
        });
    }

    // binds the 'change' event of the items found with the given selector to the given updateModel event handler
    var bindFromView = function(model, selector, updateModel, eventToBind) {
        var domElement;
        if (typeof (selector) === 'function') {
            domElement = selector(value);
        } else {
            domElement = $(selector);
        }
        updateModel(); // update it now
        if (!eventToBind) { eventToBind = 'change'; }
        domElement.bind(eventToBind, updateModel); // update it with each change
        return model;
    }

    var bindFromProperty = function(model, modelAttribute, listenSelector, valueSelector, domProperty, translate, eventToBind) {
        if (valueSelector === undefined) {
            valueSelector = listenSelector;
        }
        var updateModel = function() {
            var domElement = (typeof (valueSelector) === 'function') ? valueSelector() : $(valueSelector),
			value;
			
			switch(domProperty){
				case undefined:
				case 'val':
					value = domElement.val();
					break;
				case 'text':
					value = domElement.text();
					break;
				default:
					value = domElement.attr(domProperty);
					break;
			}
            if (translate !== undefined) {
                value = translate(value);
            }
            $(model).attr(modelAttribute, value);
        }
        return bindFromView(model, listenSelector, updateModel, eventToBind);
    }

    var bindFromRadio = function(model, modelAttribute, selector, translate, eventToBind) {
        return bindFromProperty(model, modelAttribute, selector, function(){return $(selector).filter(":checked");}, 'val', translate, eventToBind);
    }

    var bindFromButton = function(model, modelAttribute, selector, translate, eventToBind) {
        var domElement = (typeof (selector) === 'function') ? selector() : $(selector);
        if (!eventToBind) { eventToBind = 'click'; }
        domElement.bind(eventToBind, function() {
            var value = (typeof (translate) === 'function') ? translate(this.value) : this.value;
            $(model).attr(modelAttribute, value);
        });
        return model;
    }

    var bindFromCheckBox = function(model, modelAttribute, selector, translate, eventToBind) {
        var updateModel = function() {
            // fill the model field with the all captured data
            var values = [];
            $.each($(selector).filter(":checked"), function(i, elem) {
                values[i] = elem.value;
                if (translate !== undefined) values[i] = translate(values[i]);
            });
            // TODO: work directly with the array
            $(model).attr(modelAttribute, values.join(','));
        }
        return bindFromView(model, selector, updateModel, eventToBind);
    }

    var bindFromMultiSelect = function(model, modelAttribute, selector, translate, eventToBind) {
        var updateModel = function() {
            // fill the model field with the all captured data
            var values = [];
            if ($(selector).val() != null) {
                $.each($(selector).val(), function(i, elem) {
                    values[i] = elem;
                    if (translate !== undefined) values[i] = translate(values[i]);
                });
            }
            // TODO: work directly with the array
            $(model).attr(modelAttribute, values.join(','));
        }
        return bindFromView(model, selector, updateModel, eventToBind);
    }

    var dataBind = function(model, modelAttribute, selector, translateTo, translateFrom, domProperty, initialDataInDom, eventToBind) {
        switch (getBindingType(selector)) {
			case null:
				break; // nothing to do
            case 'radio':
                if (initialDataInDom) {
                    bindFromRadio(model, modelAttribute, selector, translateFrom, eventToBind);
                    bindToRadio(model, modelAttribute, selector, translateTo);
                }
                else {
                    bindToRadio(model, modelAttribute, selector, translateTo);
                    bindFromRadio(model, modelAttribute, selector, translateFrom, eventToBind);
                }
                break;
            case 'checkbox':
                if (initialDataInDom) {
                    bindFromCheckBox(model, modelAttribute, selector, translateFrom, eventToBind);
                    bindToCheckBox(model, modelAttribute, selector, translateTo);
                }
                else {
                    bindToCheckBox(model, modelAttribute, selector, translateTo);
                    bindFromCheckBox(model, modelAttribute, selector, translateFrom, eventToBind);
                }
                break;
            case 'multiselect':
                if (initialDataInDom) {
                    bindFromMultiSelect(model, modelAttribute, selector, translateFrom, eventToBind);
                    bindToMultiSelect(model, modelAttribute, selector, translateTo);
                }
                else {
                    bindToMultiSelect(model, modelAttribute, selector, translateTo);
                    bindFromMultiSelect(model, modelAttribute, selector, translateFrom, eventToBind);
                }
                break;
            case 'button':
                bindFromButton(model, modelAttribute, selector, translateFrom, eventToBind);
                break;
            case 'text':
            case 'dropdown':
                if (!domProperty) domProperty = 'val';
                // no break here, let it through to default
            default:
                if (!domProperty) domProperty = 'text';
                if (initialDataInDom) {
                    bindFromProperty(model, modelAttribute, selector, selector, domProperty, translateFrom, eventToBind);
                    bindToProperty(model, modelAttribute, selector, domProperty, translateTo);
                }
                else {
                    bindToProperty(model, modelAttribute, selector, domProperty, translateTo);
                    bindFromProperty(model, modelAttribute, selector, selector, domProperty, translateFrom, eventToBind);
                }
                break;
        }
        return model;
    }

	var autoBind = function(model, initialDataInDom, eventToBind){
		$.each(model[0], function(name){
			if(!name.match('^jQuery')){
				// bind to these elements
				dataBind(model, name, '#'+name, undefined, undefined, undefined, initialDataInDom, eventToBind);
				dataBind(model, name, '[name='+name+']', undefined, undefined, undefined, initialDataInDom, eventToBind);
				dataBind(model, name, 'label[for='+name+']', undefined, undefined, undefined, initialDataInDom, eventToBind);
			}			
		})
		
		return model;
	}
	
	
    $.fn.extend({
        // Returns the appropriate binding type for the first DOM element matched by the given selector.
        getBindingType: getBindingType,

        // Does data binding (bidirectional linking) according to the given configuration.
        // The configuration object's used fields:
        // 	   modelAttribute: (required) the name of the model's attribute to bind.
        // 	   selector: (required) either a JQuery selector string or a function which returns an array of DOM objects.
        // 	   translateTo: optional function to translate the model values into the values to store in DOM elements. If missing, these values are not changed in any way.
        // 	   translateFrom: optional function to translate the values fetched from DOM into the values to store in model. If missing, these values are not changed in any way.
        // 	   domProperty: the name of the DOM attribute to bind to the model.
        // 	   initialDataInDom: if truthy, the bidirectional bindings will use the data found in DOM, otherwise the data found in model prevails.
        // Binds bidirectionally the specified model property with the DOM property with the given name 
        // of the objects found with the specified selector. 
        // The optional translate functions convert the values.
        // WARNING: the 2 translation functions must be opposite f(g(x))=x=g(f(x)), because when changing the bound DOM elements,
        // the handler for the raised event (usually 'change') updates the bound model field, action which in turn raises 
        // an event which triggers a silent (eventless) update of the bound DOM elements.
        // If the domProperty is ommitted, then the appropriate property is chosen according to the matched DOM elemens (val() or text()).
        // Usually you need to call this function with only the first two parameters filled.
        dataBind: function(config){
            return dataBind(this, config.modelAttribute, config.selector, config.translateTo, config.translateFrom, config.domProperty, config.initialDataInDom, config.eventToBind);
		},
		// Does convention based data binding. It searches in DOM for ids and names matching the model fields
		autoBind: function(config){
			if(config==null || config==undefined)
				return autoBind(this);
			return autoBind(this, config.initialDataInDom, config.eventToBind);
		}
    });
})(jQuery);
