import * as $ from "jquery";
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

var userCtrl = new UserController();
var roomController = new RoomController( userCtrl );

$(document).ready(() =>
{
	let bv = new BoardView();
	let arr = bv.ToArray();
	bv.MoveBead( new Pot( 0 ),new Pot( 1 ) );

    $(".pot").click(async function()
    {
		try
		{
			// await userCtrl.Login( "chili","chilipass" );
			// let room = await roomController.CreateRoom( "Dicks pumper XTREME!","" );
			// await room.Leave();
			// await room.Leave();
			// let srooms = await roomController.ListRooms();
		}
		catch( e )
		{
			alert( e );
		} 
    });
});