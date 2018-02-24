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
		try
		{
			var response = await Promise.resolve( $.post( "../manserv/LoginController.php",
			{
				"cmd" : "login",
				"userName" : userName,
				"password" : password
			} ) );
		}
		catch( errPromise )
		{
			errPromise.fail(( jqXHR,textStatus,errorThrown ) => {
				throw new Error( "$.post ajax failed: " + textStatus + " % " + errorThrown )
			} );
		}

		if( response.status.isFail )
		{			
			throw new Error( "$.post failed, server returned: " + response.status.message );
		}

		this.userId = response.payload.id;
		this.userName = response.payload.name;
		this.loggedIn = true;
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
