"use strict";

$(document).ready(() =>
{
	$("#overlay")
		.hide()
		.css( "visibility","visible" );
});

function click_show()
{
	$("#overlay").fadeIn( 400 );
}

function click_hide()
{
	$("#overlay").fadeOut( 400 );
}