import * as $ from "jquery";
import Globals from "./MancalaGlobals";
import LoginWindow from "./LoginWindow";


$(document).ready(() =>
{
	// hide all popup overlays
	$("#login-overlay").hide();
	$("#room-overlay").hide();
	$("#create-overlay").hide();
	$("#join-overlay").hide();
	$("#game-overlay").hide();
	$("#result-overlay").hide();
	$("#forfeit-overlay").hide();

	Globals.Init();

	new LoginWindow();
} );