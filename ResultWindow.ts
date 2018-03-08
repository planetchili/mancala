import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import Room from "./Room";
import Window from "./Window";
import GameWindow from "./GameWindow";
import RoomWindow from "./RoomWindow";
import Game from "./Game";
import Side from "./Side";
import WinState from "./WinState";

export default class ResultWindow extends Window
{
	private roomWindow : RoomWindow;
	private game : Game;

	public constructor( roomWindow:RoomWindow,game:Game )
	{
		super();
		this.roomWindow = roomWindow;
		this.game = game;

		$("#back-button").click( () => this.OnBack() );
		this.Render();
		this.Show();
	}

	private Render() : void
	{
		const scores = this.game.GetScores();
		// set player result infos
		for( let i = 0; i < 2; i++ )
		{
			const player = this.game.GetPlayers()[i];
			$("#result-overlay-player" + i + " p.username").text( player.name );
			$("#result-overlay-player" + i + " p.score").text( scores[i] );
			$("#result-overlay-player" + i + " p.result").text( 
				this.GenerateResultText( new Side( i ) )
			);
		}
	}

	private GenerateResultText( side:Side ) : string
	{
		const ws = this.game.GetWinState();
		if( side.IsTop() )
		{
			switch( ws )
			{
			case WinState.TopWins:
				return "Win";
			case WinState.BottomWins:
				return "Lose";
			case WinState.Tie:
				return "Tie";
			case WinState.InProgress:
				return "In progress";
			case WinState.TopForfeits:
				return "Forfeit";
			case WinState.BottomForfeits:
				return "Win";
			}
		}
		else
		{
			switch( ws )
			{
			case WinState.TopWins:
				return "Lose";
			case WinState.BottomWins:
				return "Win";
			case WinState.Tie:
				return "Tie";
			case WinState.InProgress:
				return "In progress";
			case WinState.TopForfeits:
				return "Win";
			case WinState.BottomForfeits:
				return "Forfeit";
			}
		}
		return "Fukt!";
	}

	private async OnBack() : Promise<void>
	{
		try
		{
			await this.roomWindow.GetRoom().QuitGame();
			
			this.roomWindow.Render();
			this.roomWindow.Show();
			this.roomWindow.StartUpdateThread();

			this.Destroy();
		}
		catch( e )
		{
			alert( e );
		}
	}

	public Show() : void
	{
		Window._Show( "#result-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#result-overlay" );
	}

	public Destroy() : void
	{
		$("#back-button").off();
		this.Hide();
	}
}