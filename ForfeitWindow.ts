import Window from "./Window";
import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import SimpleRoom from "./SimpleRoom";
import RoomWindow from "./RoomWindow";
import GameWindow from "./GameWindow";
import WinState from "./WinState";
import ResultWindow from "./ResultWindow";


export default class JoinWindow extends Window
{
	private roomWindow : RoomWindow;
	private gameWindow : GameWindow;

	public constructor( gameWindow:GameWindow,roomWindow:RoomWindow )
	{
		super();
		this.roomWindow = roomWindow;
		this.gameWindow = gameWindow;
		$("#forfeit-button").click( () => this.OnForfeit() );
		$("#forfeit-overlay div.close").click( () => this.OnClose() );
		this.Show();
	}

	public async OnForfeit() : Promise<void>
	{
		try
		{
			// if first out, we lose quit to room
			if( !(await this.roomWindow.GetRoom().QuitGame()) )
			{
				alert( "Opponent already forfeited; you win!" );
			}

			this.roomWindow.Render();
			this.roomWindow.Show();
			this.roomWindow.StartUpdateThread();

			this.gameWindow.Destroy();
			this.Destroy();
		}
		catch( e )
		{
			alert( "Failed to join: " + e );
		}
	}

	public OnClose() : void
	{
		this.Destroy();
		this.gameWindow.Resume();
	}

	public Show() : void
	{
		Window._Show( "#forfeit-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#forfeit-overlay" );
	}
	
	public Destroy() : void
	{
		$("#forfeit-button").off();
		$("#forfeit-overlay div.close").off();
		this.Hide();
	}
}