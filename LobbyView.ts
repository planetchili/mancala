import SimpleRoom from "./SimpleRoom";
import * as $ from "jquery";
import * as Util from "./Util";
import Globals from "./MancalaGlobals";
import RoomWindow from "./RoomWindow";
import CreateWindow from "./CreateWindow";

export default class LobbyView
{
	private rooms : SimpleRoom[];

	public constructor()
	{
		this.rooms = [];

		$("#spawn-create-button").click(async () =>
		{
			try
			{
				new CreateWindow();
			}
			catch( e )
			{
				alert( e );
			}
		} );
	}

	public Update( uRooms:SimpleRoom[] ) : void
	{
		if( this.rooms.length !== uRooms.length || 
			!this.rooms.every( (room:SimpleRoom,i:number) =>
			room.equals( uRooms[i] )
		) )
		{
			this.rooms = uRooms;
			$("#lobby-body").empty();
			for( let room of this.rooms )
			{
				this.MakeRoomCard( room );
			}
		}
	}

	private MakeRoomCard( sroom:SimpleRoom ) : void
	{
		const buttonId = 'room-join-button' + sroom.id;

		const playerGen = function( room:SimpleRoom,i:number ) : string
		{
			if( i === 1 && room.playerNames.length === 1 )
			{
				return '<button id="' + buttonId + '">JOIN</button>';
			}
			else
			{
				return "<p>" + room.playerNames[i] + "</p>";
			}
		};

		const statusGen = function( sroom:SimpleRoom ) : string
		{
			if( sroom.playerNames.length === 1 )
			{
				return "waiting for second player";
			}
			else if( sroom.engaged )
			{
				return "game in progress";
			}
			else
			{
				return "idle";
			}
		};

		$("#lobby-body").append( 
			'<div class="room-card"><h3>' + 
			(sroom.locked ? '&#x1f512; ' : '') + sroom.name +
			'</h3><div class="player-wrap">' + 
			playerGen( sroom,0 ) +
			playerGen( sroom,1 ) +
			'</div><p class="status">' +
			statusGen( sroom ) +
			'</p></div>'
		);
		$("#" + buttonId).click( () => this.OnJoin( sroom ) );
	}

	private async OnJoin( sroom:SimpleRoom ) : Promise<void>
	{
		try
		{
			new RoomWindow( await Globals.roomController.JoinRoom( sroom,"" ) );
		}
		catch( e )
		{
			alert( e );
		}
	}
}