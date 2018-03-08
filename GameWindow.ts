import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import Room from "./Room";
import Window from "./Window";
import BoardView from "./BoardView";
import Game from "./Game";
import * as assert from "assert";
import Board from "./Board";
import RoomWindow from "./RoomWindow";
import WinState from "./WinState";
import ResultWindow from "./ResultWindow";

export default class GameWindow extends Window
{
	private roomWindow : RoomWindow;
	private updateStopFlag : boolean;
	private threadRunning : boolean;
	private boardView : BoardView;
	private game : Game;

	public constructor( roomWindow:RoomWindow )
	{
		super();
		this.updateStopFlag = true;
		this.threadRunning = false;
		this.roomWindow = roomWindow;
	}	

	public async Init() : Promise<void>
	{
		this.game = await this.roomWindow.GetRoom().GetGame();
		if( this.game.GetWinState() !== WinState.InProgress )
		{
			new ResultWindow( this.roomWindow,this.game );
			this.Destroy();
		}
		else
		{
			this.Render();
			this.Show();
			this.boardView = new BoardView( this.game.GetBoardState() );
			this.StartUpdateThread();
		}
	}

	private Render() : void
	{
		// reset name tag classes and remove handler
		$("div#game-wrapper div.name-tag")
			.attr( "class","name-tag" )
			.off();
		// set tag classes and content
		for( let i = 0; i < 2; i++ )
		{
			const jqe = $("#game-name-tag" + i);
			jqe.text( this.game.GetPlayers()[i].name );
			if( this.game.GetOurSide().GetIndex() === i )
			{
				jqe.addClass( "name-tag-self" );
				// add handler for forfeit screen
			}
			else
			{
				jqe.addClass( "name-tag-opponent" );
			}
			if( this.game.GetActiveSide().GetIndex() === i )
			{
				jqe.addClass( "name-tag-hilighted" );
			}
		}
	}

	private StartUpdateThread()
	{
		if( this.updateStopFlag )
		{
			this.updateStopFlag = false;
			this.RunUpdate();
		}
	}

	private async StopUpdateThread() : Promise<void>
	{
		this.updateStopFlag = true;
		// this will poll every 80ms to check for thread death
		const func = (resolve,thisfunc) =>
		{
			if( !this.threadRunning )
			{
				resolve();
			}
			else
			{
				setTimeout( () => thisfunc( resolve,thisfunc ),80 );
			}
		};
		await new Promise<void>( (resolve) => func( resolve,func ) );
	}

	private async RunUpdate() : Promise<void>
	{
		// continually update while not both players ready
		this.threadRunning = true;
		try
		{
			do
			{
				const actions = await this.game.Update();
				if( actions.length != 0 )
				{
					this.Render();
					await this.boardView.ReplayAnimation( actions );
					const board_state = this.game.GetBoardState();
					assert( this.boardView.ToArray().every( 
						(pot,i) => pot === board_state[i] ),
						"view don't match board updated from server"
					);
				}
				if( this.game.GetWinState() !== WinState.InProgress )
				{
					new ResultWindow( this.roomWindow,this.game );
					this.updateStopFlag = true;
					this.Destroy();
				}
				else if( this.game.GetActiveSide().equals( this.game.GetOurSide() ) )
				{
					this.AddPotListeners();
					this.updateStopFlag = true;
				}
			}
			while( !this.updateStopFlag );
		}
		catch( e )
		{
			alert( e );			
			this.RunUpdate();
		}
		this.threadRunning = false;
	}

	private RemovePotListeners() : void
	{
		$(".pot")
			.off( "click mouseenter mouseleave" )
			.removeClass( "pot-hilight" )
			.css( "cursor","default" );
	}

	private AddPotListeners() : void
	{
		// cache the board state array
		const board_state = this.game.GetBoardState();
		// side filter selector
		const sfs = this.game.GetOurSide().IsTop() ? ".topmid" : ".botmid";
		// filter so that only pots with beads can be clicked
		$(sfs + " .pot").filter( ( index:number,element:HTMLElement ) =>
			board_state[BoardView.GetPotFromElement( $(element) ).GetIndex()] !== 0
		)
		.click( (event:JQuery.Event) => this.OnPot( event ) )
		.css( "cursor","pointer" )
		.hover( function(){ $(this).toggleClass( "pot-hilight" ) } );
	}

	private async OnPot( event:JQuery.Event ) : Promise<void>
	{
		try
		{
			this.RemovePotListeners();
			const result = this.game.DoMove( BoardView.GetPotFromElement( $(event.currentTarget) ) );
			await this.boardView.ReplayAnimation( result.seq );
			await result.promise;
			const board_state = this.game.GetBoardState();
			assert( this.boardView.ToArray().every( (pot,i) => pot === board_state[i] ),
				"view don't match board updated from server"
			);
			this.Render();
			this.StartUpdateThread();
		}
		catch( e )
		{
			// panic
			alert( e );
		}
	}

	public Show() : void
	{
		Window._Show( "#game-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#game-overlay" );
	}

	public Destroy() : void
	{
		this.RemovePotListeners();
		$("div#game-wrapper div.name-tag").off();
		this.Hide();
	}
}