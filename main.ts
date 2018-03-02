import * as $ from "jquery";
import UserController from "./UserController";
import RoomController from "./RoomController";
import SimpleRoom from "./SimpleRoom";
import Room from "./Room";
import Board from "./Board";
import Pot from "./Pot";
import Side from "./Side";

var userCtrl = new UserController();
var roomController = new RoomController( userCtrl );

$(document).ready(() =>
{
    $("p").click(async function()
    {
		try
		{
			await userCtrl.Login( "chili","chilipass" );
			let room = await roomController.CreateRoom( "Dicks pumper XTREME!","" );
			await room.Leave();
			await room.Leave();
			let srooms = await roomController.ListRooms();

			$("#shame").text( "" + srooms.length );
		}
		catch( e )
		{
			alert( e );
		}
    });
});