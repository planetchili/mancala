import * as $ from "jquery";
import Globals from "./MancalaGlobals";
import LoginWindow from "./LoginWindow";


$(document).ready(() =>
{
	// hide all popup overlays
	$("div.overlay").hide();

	Globals.Init();

	new LoginWindow();
} );