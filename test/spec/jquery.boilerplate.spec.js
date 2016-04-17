( function( $, QUnit ) {

	"use strict";

	var $testCanvas = $( "#testCanvas" );
	var $fixture = null;

	QUnit.module( "jQuery formValidator", {
		beforeEach: function() {

			// fixture is the element where your jQuery plugin will act
			$fixture = $( "<input/>" );

			$testCanvas.append( $fixture );
		},
		afterEach: function() {

			// we remove the element to reset our plugin job :)
			$fixture.remove();
		}
	} );

	QUnit.test( "is inside jQuery library", function( assert ) {

		assert.equal( typeof $.fn.formValidator, "function", "has function inside jquery.fn" );
		assert.equal( typeof $fixture.formValidator, "function", "another way to test it" );
	} );

	QUnit.test( "returns jQuery functions after called (chaining)", function( assert ) {
		assert.equal(
			typeof $fixture.formValidator().on,
			"function",
			"'on' function must exist after plugin call" );
	} );

	QUnit.test( "caches plugin instance", function( assert ) {
		$fixture.formValidator();
		assert.ok(
			$fixture.data( "plugin_formValidator" ),
			"has cached it into a jQuery data"
		);
	} );

	QUnit.test( "enable custom config", function( assert ) {
		$fixture.formValidator( {
			pattern: /pattern/,
			foo: "bar"
		} );

		var pluginData = $fixture.data( "plugin_formValidator" );

		assert.equal(
			pluginData.settings.foo,
			"bar",
			"extend plugin settings"
		);

	} );


}( jQuery, QUnit ) );
