import Window from "./Window";
import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import RoomWindow from "./RoomWindow";


export default class CreateWindow extends Window
{
	public constructor()
	{
		super();
		$("#create-button").click( () => this.OnCreate() );
		$("#create-overlay div.close").click( () => this.OnClose() );
		this.Show();
	}

	public async OnCreate() : Promise<void>
	{
		try
		{
			const room = await Globals.roomController.CreateRoom( 
				$("#create-name").val() as string,
				$("#create-password").val() as string
			);

			// update lobby in background async
			(async () =>
				Globals.lobbyView.Update( await Globals.roomController.ListRooms() )
			)();

			new RoomWindow( room ).Init();

			this.Destroy();
		}
		catch( e )
		{
			alert( "Failed to create room: " + e );
		}
	}

	public OnClose() : void
	{
		this.Destroy();
	}

	public Show() : void
	{
		Window._Show( "#create-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#create-overlay" );
	}

	public Destroy() : void
	{
		$("#create-button").off();
		$("#create-overlay div.close").off();
		this.Hide();
	}
}