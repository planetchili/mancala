import * as $ from "jquery";
import UserController from "./UserController";

var userCtrl = new UserController();

$(document).ready(() =>
{
    $("p").click(async function()
    {
		try
		{
            await userCtrl.Login( "chili","chilipass" );
            $("#shame").text( "UID: " + userCtrl.GetUserId() );
		}
		catch( e )
		{
			$("#shame").text( e );
		}
    });
});