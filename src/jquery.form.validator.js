// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "formValidator",
			defaults = {
				colorNOK: 'red',
				colorOK: 'green'
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = $(element);

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.call(options);
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			call: function(options) {
				var methods = this;
				console.log(options);
				var method = Object.keys(options)[0];

				if (methods[method]) {
					return methods[method].apply(this, arguments);
				} else {
					$.error('Method ' + method + ' does not exist on jQuery.form.validator');
				}

			},
			pattern: function(options) {
				var pattern = options.pattern;
				var $element = this.element;
				var settings = this.settings;

				$element.on('keydown keyup keypress', function(e){

					if (!$element.val().match(pattern)) {
						$element.siblings('input[type="submit"]').attr('disabled', 'disabled');
						$element.css({
							"border-color": settings.colorNOK,
							"border-style": "solid"
						});
					} else {
						$element.siblings('input[type="submit"]').removeAttr('disabled');
						$element.css({"border-color": settings.colorOK});
					}
				});
			},
			email: function(options) {
				var $element = this.element;
				var settings = this.settings;

				$element[pluginName]({pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i});
			}

		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );