import * as $ from "jquery";
import LoginWindow from "./LoginWindow";
import Globals from "./MancalaGlobals";

export default class AccountWidget
{
	private loggedIn : boolean;
	private username : string;
	private userId : number;

	public constructor()
	{
		this.ClearUser();
		$("#header-logout-button").click( () => this.OnLogout() );
	}

	public SetUser( username:string,userId:number ) : void
	{
		this.username = username;
		this.userId = userId;
		this.loggedIn = true;
		$( "div#lobby-user p" ).text( this.username );
	}

	public ClearUser() : void
	{
		this.loggedIn = false;
		$("div#lobby-user p").text( "----" );
	}

	public async OnLogout() : Promise<void>
	{
		if( this.loggedIn )
		{
			this.ClearUser();
			Globals.lobbyView.StopAndClear();
			await Globals.userCtrl.Logout();
			new LoginWindow();
		}
	}
}