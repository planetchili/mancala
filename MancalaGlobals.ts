import UserController from "./UserController";
import RoomController from "./RoomController";
import BoardView from "./BoardView";
import Game from "./Game";
import LobbyView from "./LobbyView";

export default class Globals
{
	public static userCtrl : UserController;
	public static lobbyView : LobbyView;
	public static roomController : RoomController;
	// TODO: these guys might need to go (put them in something else relevent)
	public static game : Game;
	public static boardView : BoardView;

	public static Init() : void
	{
		Globals.userCtrl = new UserController();
		Globals.roomController = new RoomController( Globals.userCtrl );
		Globals.lobbyView = new LobbyView();
	}
}