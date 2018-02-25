import * as $ from "jquery";
import UserController from "./UserController";

var userCtrl = new UserController();

$(document).ready(() =>
{
    $("p").click(async function()
    {
		try
		{
            await userCtrl.Login( "mom","mompass" );
			$("#shame").text( "UID: " + userCtrl.GetUserId() );
			await userCtrl.Logout();
			$("#shame").text( "UID2: " + userCtrl.GetUserId() );
		}
		catch( e )
		{
			alert( e );
		}
    });
});