import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import Room from "./Room";
import Window from "./Window";

export default class RoomWindow extends Window
{
	private room : Room;
	private checkSelector : string;

	public constructor( room:Room )
	{
		super();
		this.room = room;
		$("#leave-button").click( () => this.OnLeave() );
		this.Render();
		this.Show();
		this.RunUpdate();
	}

	private Render() : void
	{
		$("#room-overlay h3")
			.empty()
			.append( "Room: [" + this.room.GetName() + "]" );
		
		// remove old handers
		$("#room-overlay-player0 input").off();
		$("#room-overlay-player1 input").off();
		
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
	}

	private async OnReady() : Promise<void>
	{
		try
		{
			if( $(this.checkSelector).prop( "checked" ) == true )
			{
				await this.room.Ready();
				// test for engaged? (or just **wait for polling to handle it**?)
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

	private async RunUpdate() : Promise<void>
	{
		// continually update while not both players ready
		try
		{
			do
			{
				if( await this.room.Update() )
				{
					this.Render();
				}
			}
			while( !this.room.IsReadyToEngage() );
		}
		catch( e )
		{
			alert( e );			
			this.RunUpdate();
		}

		// spawn game and exit
		alert( "Game starting! #" + this.room.GetGameId() );
	}

	private async OnLeave() : Promise<void>
	{
		try
		{
			await Globals.roomController.LeaveRoom( this.room );
			Globals.lobbyView.Update( await Globals.roomController.ListRooms() );

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