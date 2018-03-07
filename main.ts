import * as $ from "jquery";
import * as assert from "assert";
import UserController from "./UserController";
import RoomController from "./RoomController";
import SimpleRoom from "./SimpleRoom";
import Room from "./Room";
import Board from "./Board";
import Pot from "./Pot";
import Side from "./Side";
import BoardView from "./BoardView";
import Color from "./Color";
import Point from "./Point";
import Game from "./Game";
import LobbyView from "./LobbyView";
import Globals from "./MancalaGlobals";
import LoginWindow from "./LoginWindow";
import CreateWindow from "./CreateWindow";


$(document).ready(() =>
{
	// hide all popup overlays
	$("#login-overlay").hide();
	$("#room-overlay").hide();
	$("#create-overlay").hide();
	$("#join-overlay").hide();
	$("#game-overlay").hide();

	$("#login-open-button").click(() =>
	{
		$("#login-overlay").fadeIn( 300 );  
	} );
	// $("#dialog-1-close").click(() =>
	// {
	// 	$("#dialog-1").fadeOut( 300 );
	// } );

	// $("#login-overlay").fadeIn( 300 );

	new LoginWindow();

	$("#spawn-create-button").click(async () =>
	{
		try
		{
			new CreateWindow();
		}
		catch( e )
		{
			alert( e );
		}
	} );
} );

function RemoveClickListeners() : void
{
	$(".pot")
		.off( "click mouseenter mouseleave" )
		.removeClass( "pot-hilight" )
		.css( "cursor","default" );
}

async function AddClickListeners() : Promise<void>
{
	// just poll while not our turn, updating when behind server
	while( !Globals.game.GetActiveSide().equals( Globals.game.GetOurSide() ) )
	{
		try
		{
			const actions = await Globals.game.Update();
			if( actions.length != 0 )
			{
				await Globals.boardView.ReplayAnimation( actions );
				const board_state = Globals.game.GetBoardState();
				assert( Globals.boardView.ToArray().every( (pot,i) => pot === board_state[i] ),"view don't match board updated from server" );
			}
		}
		catch( e )
		{
			// panic
			alert( e );
		}
	}

	// cache the board state array
	const board_state = Globals.game.GetBoardState();
	// side filter selector
	const sfs = Globals.game.GetOurSide().IsTop() ? ".topmid" : ".botmid";
	// filter so that only pots with beads can be clicked
	$(sfs + " .pot").filter( ( index:number,element:HTMLElement ) =>
		board_state[BoardView.GetPotFromElement( $(element) ).GetIndex()] !== 0
	)
	.click( async function()
	{
		try
		{
			RemoveClickListeners();
			const result = Globals.game.DoMove( BoardView.GetPotFromElement( $(this) ) );
			await Globals.boardView.ReplayAnimation( result.seq );
			await result.promise;
			const board_state = Globals.game.GetBoardState();
			assert( Globals.boardView.ToArray().every( (pot,i) => pot === board_state[i] ),"view don't match board updated from server" );
			AddClickListeners();
		}
		catch( e )
		{
			// panic
			alert( e );
		} 
	} )
	.css( "cursor","pointer" )
	.hover( function(){ $(this).toggleClass( "pot-hilight" ) } );
}