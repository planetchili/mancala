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

var userCtrl = new UserController();
var roomController = new RoomController( userCtrl );
var boardView : BoardView;
var game : Game;

$(document).ready(() =>
{
	$("#trigger-1").click(() =>
	{
		$("#dialog-1").fadeIn( 300 );  
	} );
	$("#dialog-1-close").click(() =>
	{
		$("#dialog-1").fadeOut( 300 );
	} );

	$("#trigger-2").click(() =>
	{
		$("#dialog-2").fadeIn( 300 );  
	} );
	$("#dialog-2-close").click(() =>
	{
		$("#dialog-2").fadeOut( 300 );
	} );

	$("#dotestbtn").click(async () =>
	{
		try
		{
			const name = $("#login_name").val() as string;
			const password = $("#login_password").val() as string;
			await userCtrl.Login( name,password );
			let srooms = await roomController.ListRooms();
			// let room = await roomController.JoinRoom( srooms[0],"" );
			let room = await roomController.GetRoomIfJoined() as Room;
			// await room.Ready();
			game = await room.GetGame();

			boardView = new BoardView( game.GetBoardState() );
			AddClickListeners();
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
	while( !game.GetActiveSide().equals( game.GetOurSide() ) )
	{
		try
		{
			const actions = await game.Update();
			if( actions.length != 0 )
			{
				await boardView.ReplayAnimation( actions );
				const board_state = game.GetBoardState();
				assert( boardView.ToArray().every( (pot,i) => pot === board_state[i] ),"view don't match board updated from server" );
			}
		}
		catch( e )
		{
			// panic
			alert( e );
		}
	}

	// cache the board state array
	const board_state = game.GetBoardState();
	// side filter selector
	const sfs = game.GetOurSide().IsTop() ? ".topmid" : ".botmid";
	// filter so that only pots with beads can be clicked
	$(sfs + " .pot").filter( ( index:number,element:HTMLElement ) =>
		board_state[BoardView.GetPotFromElement( $(element) ).GetIndex()] !== 0
	)
	.click( async function()
	{
		try
		{
			RemoveClickListeners();
			const result = game.DoMove( BoardView.GetPotFromElement( $(this) ) );
			await boardView.ReplayAnimation( result.seq );
			await result.promise;
			const board_state = game.GetBoardState();
			assert( boardView.ToArray().every( (pot,i) => pot === board_state[i] ),"view don't match board updated from server" );
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