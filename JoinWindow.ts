import Window from "./Window";
import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import SimpleRoom from "./SimpleRoom";
import RoomWindow from "./RoomWindow";

// TODO: add close button
export default class JoinWindow extends Window
{
	private sroom : SimpleRoom;

	public constructor( sroom:SimpleRoom )
	{
		super();
		this.sroom = sroom;
		$("#join-button").click( () => this.OnJoin() );
		this.Show();
	}

	public async OnJoin() : Promise<void>
	{
		try
		{
			new RoomWindow( await Globals.roomController.JoinRoom( 
				this.sroom,
				$("#join-password").val() as string
			) );

			this.Destroy();
		}
		catch( e )
		{
			alert( "Failed to join: " + e );
		}
	}

	public Show() : void
	{
		Window._Show( "#join-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#join-overlay" );
	}
	
	public Destroy() : void
	{
		$("#join-button").off();
		this.Hide();
	}
}