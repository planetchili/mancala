import * as assert from "assert";
import * as Util from "./Util";
import * as $ from "jquery";

export default class UserController
{
	private userId : number;
	private userName : string;
	private loggedIn : boolean;

	public constructor()
	{
		this.userId = -1;
		this.userName = "";
		this.loggedIn = false;
	}

	public async Login( userName : string,password : string ) : Promise<void>
	{
		assert( this.loggedIn,"Already logged in!" );
		let userData = await Util.post( "../manserv/LoginController.php",
		{
			"cmd" : "login",
			"userName" : userName,
			"password" : password
		} ) as any;

		this.userId = userData.id;
		this.userName = userData.name;
		this.loggedIn = true;
	}

	public async Logout() : Promise<void>
	{
		assert( this.loggedIn,"Not logged in!" );
		await Util.post( "../manserv/LoginController.php",
		{
			"cmd" : "logout"
		} );

		this.userId = -1;
		this.userName = "";
		this.loggedIn = false;
	}

	public IsLoggedIn() : boolean
	{
		return this.loggedIn;
	}

	public GetUserName() : string
	{
		assert( this.loggedIn,"Not logged in!" );
		return this.userName;
	}

	public GetUserId() : number
	{
		assert( this.loggedIn,"Not logged in!" );
		return this.userId;
	}
}