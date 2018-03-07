import UserController from "./UserController";
import RoomController from "./RoomController";
import BoardView from "./BoardView";
import Game from "./Game";
import LobbyView from "./LobbyView";

export default class Globals
{
	public static userCtrl = new UserController();
	public static lobbyView = new LobbyView();
	public static roomController = new RoomController( Globals.userCtrl );
	public static game : Game;
	public static boardView : BoardView;
}