/*
* animate.js 
* autor zyshi
* time  2017-7-12
*/
;(function(doc, undefined) {
	var class2type = {};
	var toString = class2type.toString;
	var hasOwn = class2type.hasOwnProperty;
	var support = {};
	var rmsPrefix = /^-ms-/;
	var rdashAlpha = /-([\da-z])/gi;
	var cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
	var emptyStyle = doc.createElement("div").style;
	var cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 };
	//each方法
	function each(obj,callback){
		if(obj && typeof obj == 'object'){
			for(var key in obj){
				callback && callback(key,obj[key]);
			}
		}
	}
	var isArray = Array.isArray || function(object){ return object instanceof Array }
	// return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {

		// shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}

		// check for vendor prefixed names
		var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	//判断type类型
	var type = function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	};
	var isFunction = function( obj ) {
		return type( obj ) === "function";
	};
	var isWindow = function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	};
	var isPlainObject = function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || type( obj ) !== "object" || obj.nodeType || isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	};
	var bind = function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}
		else if(element.attachEvent){
			element.attachEvent('on'+type,handler);
		}
		else{
			element["on"+type] = handler /*直接赋给事件*/
		}
    };
	var unbind = function(element,type,handler){
		if (element.removeEventListener)
			element.removeEventListener(type, handler, false);
		else if (element.deattachEvent) {               /*IE*/
			element.deattachEvent('on' + type, handler);
		}
		else {
			element["on" + type] = null;
		}
	};
	
	var camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	function dasherize(str) {
		return str.replace(/::/g, '/')
			   .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			   .replace(/([a-z\d])([A-Z])/g, '$1_$2')
			   .replace(/_/g, '-')
			   .toLowerCase()
	  }
	  function maybeAddPx(name, value) {
		return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	  }
	  
	  HTMLElement.prototype.css = function(property, value){
      if (arguments.length < 2) {
        var element = this
        if (typeof property == 'string') {
          if (!element) return
          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
        } else if (isArray(property)) {
          if (!element) return
          var props = {}
          var computedStyle = getComputedStyle(element, '')
          each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = '';
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.style.removeProperty(dasherize(property));
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.style.removeProperty(dasherize(key));
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.style.cssText += ';' + css;
    };
	
	var fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};
	var camelCase = function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	};
	
    var prefix = '', eventPrefix, endEventName, endAnimationName, vendors = {
        Webkit : 'webkit',
        Moz : '',
        O : 'o'
    }, document = window.document, testEl = document.createElement('div'), supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, transform, transitionProperty, transitionDuration, transitionTiming, transitionDelay, animationName, animationDuration, animationTiming, animationDelay, cssReset = {}

    function dasherize(str) {
        return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
    }
    function normalizeEvent(name) {
        return eventPrefix ? eventPrefix + name : name.toLowerCase()
    }
	
    each(vendors, function(vendor, event) {
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendor.toLowerCase() + '-'
            eventPrefix = event
            return false
        }
    });

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] = cssReset[transitionDuration = prefix
            + 'transition-duration'] = cssReset[transitionDelay = prefix
            + 'transition-delay'] = cssReset[transitionTiming = prefix
            + 'transition-timing-function'] = cssReset[animationName = prefix
            + 'animation-name'] = cssReset[animationDuration = prefix
            + 'animation-duration'] = cssReset[animationDelay = prefix
            + 'animation-delay'] = cssReset[animationTiming = prefix
            + 'animation-timing-function'] = '';
	//动画配置
    doc.fx = {
        off : (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds : {
            _default : 400,
            fast : 200,
            slow : 600
        },
        cssPrefix : prefix,
        transitionEnd : normalizeEvent('TransitionEnd'),
        animationEnd : normalizeEvent('AnimationEnd')
    };
	
	// 使用原型扩展DOM自定义事件
	HTMLElement.prototype.animate = function(properties, duration, ease, callback, delay) {
		if (isFunction(duration))
			callback = duration, ease = undefined, duration = undefined
		if (isFunction(ease))
			callback = ease, ease = undefined
		if (isPlainObject(duration))
			ease = duration.easing, callback = duration.complete,
					delay = duration.delay, duration = duration.duration
		if (duration)
			duration = (typeof duration == 'number' ? duration
					: (doc.fx.speeds[duration] || doc.fx.speeds._default)) / 1000
		if (delay)
			delay = parseFloat(delay) / 1000
		return this.anim(properties, duration, ease, callback, delay)
	}
	
	HTMLElement.prototype.anim = function(properties, duration, ease, callback, delay) {
		var key, cssValues = {}, cssProperties, transforms = '', that = this, wrappedCallback, endEvent = doc.fx.transitionEnd, fired = false

		if (duration === undefined)
			duration = doc.fx.speeds._default / 1000
		if (delay === undefined)
			delay = 0
		if (doc.fx.off)
			duration = 0

		if (typeof properties == 'string') {
			// keyframe animation
			cssValues[animationName] = properties
			cssValues[animationDuration] = duration + 's'
			cssValues[animationDelay] = delay + 's'
			cssValues[animationTiming] = (ease || 'linear')
			endEvent = $.fx.animationEnd
		} else {
			cssProperties = []
			// CSS transitions
			for (key in properties)
				if (supportedTransforms.test(key))
					transforms += key + '(' + properties[key] + ') '
				else
					cssValues[key] = properties[key], cssProperties
							.push(dasherize(key))

			if (transforms)
				cssValues[transform] = transforms, cssProperties
						.push(transform)
			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ')
				cssValues[transitionDuration] = duration + 's'
				cssValues[transitionDelay] = delay + 's'
				cssValues[transitionTiming] = (ease || 'linear')
			}
		}

		wrappedCallback = function(event) {
			if (typeof event !== 'undefined') {
				if (event.target !== event.currentTarget)
					return // makes sure the event didn't bubble from "below"
					unbind(event.target,endEvent, wrappedCallback)
			} else
				unbind(this,endEvent, wrappedCallback) // triggered by
															// setTimeout

			fired = true
			this.css(cssReset)
			callback && callback.call(this)
		}
		if (duration > 0) {
			bind(this,endEvent, wrappedCallback)
			// transitionEnd is not always firing on older Android phones
			// so make sure it gets fired
			setTimeout(function() {
				if (fired)
					return

				wrappedCallback.call(that)
			}, (duration * 1000) + 25)
		}
		// trigger page reflow so new elements can animate
		this.clientLeft;
		this.css(cssValues);
		if (duration <= 0)
			setTimeout(function() {
				that.each(function() {
					wrappedCallback.call(this)
				})
			}, 0)

		return this
	}
    testEl = null
})(document);