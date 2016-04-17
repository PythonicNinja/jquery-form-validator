/*
 *  jquery-form-validator - v0.0.1
 *  jquery-form-validator
 *  https://github.com/PythonicNinja/jquery-form-validator
 *
 *  Made by Wojciech Nowak
 *  Under MIT License
 */
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
				colorNOK: "red",
				colorOK: "green",
				callbacks: {
					nok: function( plugin ) {
						plugin.element.siblings( "input[type='submit']" )
							          .attr( "disabled", "disabled" );
						plugin.element.css( {
							"border-color": plugin.settings.colorNOK,
							"border-style": "solid"
						} );
					},
					ok: function( plugin ) {
						plugin.element.siblings( "input[type='submit']" ).removeAttr( "disabled" );
						plugin.element.css( { "border-color": plugin.settings.colorOK } );
					}
				},
				passwordApiCallback: null,
				passwordMinLength: 8,
				passwordMinNumbers: 2,
				passwordMinUppercase: 1,
				passwordMinLowercase: 1,
				region: "pl",
				country: "pl",
				zipcodeCityApi: function( plugin ) {
					var url = "https://maps.googleapis.com/maps/api/geocode/json?region=" +
						this.region + "&sensor=false&components=country:" +
						this.country + "|postal_code:" + plugin.element.val( );
					$.getJSON( url, function( data ) {
						var status = data.status;
						if ( status === "OK" ) {
							var value = data.results[ 0 ].formatted_address.split( " " )[ 1 ];  // jscs:disable
							if ( value ) {
								value = value.slice( 0, -1 );
							}

							if ( typeof success_callback === "function" ) {
								success_callback( value );
							}

							if ( value ) {
								plugin.settings.zipcode.destination.val( value );
							}

						} else {
							if ( typeof failure_callback === "function" ) {
								failure_callback( );
							}
						}

					} );
				}


			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = $( element );

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.call( options );
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			call: function( options ) {
				var methods = this;

				var method = options ? Object.keys( options )[ 0 ] : null;
				if ( method ) {
					if ( methods[ method ] ) {
						return methods[ method ].apply( this, arguments );
					}
					$.error( "Method " + method + " does not exist on jQuery.form.validator" );
				} else {

					// TODO: generic check based on input type

				}

			},
			pattern: function( options ) {
				var pattern = options.pattern,
					$element = this.element,
					settings = this.settings,
					plugin = this;

				$element.on( "keydown keyup keypress", function(  ) {

					if ( !$element.val().match( pattern ) ) {
						settings.callbacks.nok( plugin );
					} else {
						settings.callbacks.ok( plugin );
					}
				} );
			},
			email: function(  ) {
				var $element = this.element;

				$element[ pluginName ]( { pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i } );
			},
			password: function( ) {
				var $element = this.element,
					settings = this.settings,
					plugin = this;

				$element.on( "keydown keyup keypress", function(  ) {
						var value = $element.val(),
						reUppercase = new RegExp( "[A-ZĄĆĘŁŃÓŚŹŻ]" ),
						reLowercase = new RegExp( "[a-ząćęłóńśźż]" ),
						reNumbers = new RegExp( "[0-9]" ),
						uppercaseCount = 0,
						lowercaseCount = 0,
						numbersCount = 0,
						length = value.length;

					for ( var i = 0; i < length; i++ ) {

						if ( reUppercase.test( value.charAt( i ) ) ) {
							uppercaseCount++;
						}

						if ( reLowercase.test( value.charAt( i ) ) ) {
							lowercaseCount++;
						}

						if ( reNumbers.test( value.charAt( i ) ) ) {
							numbersCount++;
						}

					}

					if ( length < settings.passwordMinLength ||
						uppercaseCount < settings.passwordMinUppercase ||
						lowercaseCount < settings.passwordMinLowercase ||
						numbersCount < settings.passwordMinLength ) {
						settings.callbacks.nok( plugin );
					} else {
						settings.callbacks.ok( plugin );
					}
				} );

			},
			zipcode: function( ) {
				var $element = this.element,
				settings = this.settings,
				plugin = this;

				$element.on( "keydown keyup keypress", function(  ) {

					settings.zipcodeCityApi( plugin );

				} );
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
