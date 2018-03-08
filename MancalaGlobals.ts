import UserController from "./UserController";
import RoomController from "./RoomController";
import BoardView from "./BoardView";
import Game from "./Game";
import LobbyView from "./LobbyView";
import AccountWidget from "./AccountWidget";

export default class Globals
{
	public static userCtrl : UserController;
	public static lobbyView : LobbyView;
	public static roomController : RoomController;
	public static accountWidget : AccountWidget;

	public static Init() : void
	{
		Globals.userCtrl = new UserController();
		Globals.roomController = new RoomController( Globals.userCtrl );
		Globals.lobbyView = new LobbyView();
		Globals.accountWidget = new AccountWidget();
	}
}