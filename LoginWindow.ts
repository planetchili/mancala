import Window from "./Window";
import Globals from "./MancalaGlobals";
import * as $ from "jquery";
import Room from "./Room";
import RoomWindow from "./RoomWindow";

export default class LoginWindow extends Window
{
	public constructor()
	{
		super();
		$("#login-button").click( () => this.OnLogin() );
		this.Show();
	}

	public async OnLogin() : Promise<void>
	{
		try
		{
			await Globals.userCtrl.Login( 
				$("#login-username").val() as string,
				$("#login-password").val() as string
			);

			// check if we are already in a room
			const room = await Globals.roomController.GetRoomIfJoined();
			if( room !== null )
			{
				new RoomWindow( room as Room ).Init();
				// update the lobby for shits and giggles
				(async () => Globals.lobbyView.Update(
					await Globals.roomController.ListRooms()
				))();
			}
			else
			{
				Globals.lobbyView.StartUpdateThread();
			}

			this.Destroy();
		}
		catch( e )
		{
			alert( "Failed to log in: " + e );
		}
	}

	public Show() : void
	{
		Window._Show( "#login-overlay",this );
	}

	public Hide() : void
	{
		Window._Hide( "#login-overlay" );
	}
	
	public Destroy() : void
	{
		$("#login-button").off();
		this.Hide();
	}
}