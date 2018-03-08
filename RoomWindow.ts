import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import Room from "./Room";
import Window from "./Window";
import GameWindow from "./GameWindow";
import WinState from "./WinState";

export default class RoomWindow extends Window
{
	private room : Room;
	private checkSelector : string;
	private updateStopFlag : boolean;
	private threadRunning : boolean;

	public constructor( room:Room )
	{
		super();
		this.room = room;
		this.updateStopFlag = true;
		this.threadRunning = false;

		$("#leave-button").click( () => this.OnLeave() );
	}

	public async Init() : Promise<void>
	{
		if( this.room.IsEngaged() && this.room.GetSelf().IsReady() )
		{
			await new GameWindow( this ).Init();
		}
		else
		{
			this.Render();
			this.Show();
			this.StartUpdateThread();
		}
	}

	// TODO: better way of showing ready change after quitgame than call render direct?
	public Render() : void
	{
		$("#room-overlay h3")
			.empty()
			.append( "Room: [" + this.room.GetName() + "]" );
		
		// remove old handers and enable by default
		$("#room-overlay input")
			.off()
			.prop( "disabled",false );
		
		// TODO: DRY!!

		// set player 0
		const player0 = this.room.GetPlayers()[0];
		$("#room-overlay-player0 h4").text( 
			player0.IsOwner() ? "Owner" : "Guest"
		);
		$("#room-overlay-player0 p").text( 
			player0.GetName()
		);
		$("#room-overlay-player0 input").prop( {
			"checked" : player0.IsReady(),
			"disabled" : player0.GetId() !== this.room.GetSelf().GetId()
		} );

		// wire up handler for checkbox
		if( player0.GetId() === this.room.GetSelf().GetId() )
		{
			this.checkSelector = "#room-overlay-player0 input";
			$(this.checkSelector).change( () => this.OnReady() );
		}
		
		// set player 1 (if exists, otherwise clear fields)
		if( this.room.GetPlayerCount() === 1 )
		{
			$("#room-overlay-player1 h4").text( "Guest" );
			$("#room-overlay-player1 p").text( "-----" );
			$("#room-overlay-player1 input").prop( {
				"checked" : false,
				"disabled" : true
			} );
		}
		else
		{
			const player1 = this.room.GetPlayers()[1];
			$("#room-overlay-player1 h4").text( 
				player1.IsOwner() ? "Owner" : "Guest"
			);
			$("#room-overlay-player1 p").text( 
				player1.GetName()
			);
			$("#room-overlay-player1 input").prop( {
				"checked" : player1.IsReady(),
				"disabled" : player1.GetId() !== this.room.GetSelf().GetId()
			} );

			if( player1.GetId() === this.room.GetSelf().GetId() )
			{
				this.checkSelector = "#room-overlay-player1 input";
				$(this.checkSelector).change( () => this.OnReady() );
			}
		}

		// don't allow user to use checkbox if game is still engaged
		if( this.room.IsEngaged() )
		{
			$("#room-overlay input")
				.off()
				.prop( "disabled",true );
		}

		// set status
		let status : string;
		// hack to discriminate starting game from after leave game, also see below
		if( this.room.IsEngaged() && !this.room.IsReadyToEngage() )
		{
			status = "Game over, waiting for player to return to room";
		}
		else
		{
			if( this.room.GetPlayerCount() === 1 )
			{
				status = "Waiting for second player";
			}
			// hack to discriminate starting game from after leave game, also see above
			else if( this.room.IsReadyToEngage() )
			{
				status = "Starting game...";
			}
			else
			{
				status = "Waiting for both players to ready up";
			}
		}
		$("#room-overlay div.status").text( status );
	}

	private async OnReady() : Promise<void>
	{
		try
		{
			if( $(this.checkSelector).prop( "checked" ) == true )
			{
				await this.room.Ready();
				// don't usually get to see start message via normal thead pump so...
				if( this.room.IsReadyToEngage() )
				{
					$("#room-overlay div.status").text( "Starting game..." );
				}
			}
			else
			{
				await this.room.Unready();
			}
		}
		catch( e )
		{
			alert( e );
		}
	}

	public StartUpdateThread()
	{
		if( this.updateStopFlag )
		{
			this.updateStopFlag = false;
			this.RunUpdate();
		}
	}

	public async StopUpdateThread() : Promise<void>
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
		await new Promise<void>( resolve => func( resolve,func ) );
	}

	public GetRoom() : Room
	{
		return this.room;
	}

	private async RunUpdate() : Promise<void>
	{
		// continually update while not both players ready
		this.threadRunning = true;
		try
		{
			do
			{
				if( await this.room.Update() )
				{
					this.Render();
				}
				if( this.room.IsReadyToEngage() )
				{
					this.Hide();
					await new GameWindow( this ).Init();
					this.updateStopFlag = true;
				}
			}
			while( !this.updateStopFlag );
		}
		catch( e )
		{
			// TODO: this gets hit because sometimes game is not yet created at server side
			// when the GameWindow.Init tries to get it
			this.RunUpdate();
		}
		this.threadRunning = false;
	}

	private async OnLeave() : Promise<void>
	{
		try
		{
			await this.StopUpdateThread();
			await Globals.roomController.LeaveRoom( this.room );
			Globals.lobbyView.StartUpdateThread();

			this.Destroy();
		}
		catch( e )
		{
			alert( e );
		}
	}

	public Show() : void
	{
		Window._Show( "#room-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#room-overlay" );
	}

	public Destroy() : void
	{
		$("#leave-button").off();
		$("#room-overlay input").off();
		this.Hide();
	}
}