import * as assert from "assert";
import * as Util from "./Util";
import UserController from "./UserController";
import SimpleRoom from "./SimpleRoom";
import Room from "./Room";

export default class RoomController
{
	private userCtrl : UserController;
	
	public constructor( userCtrl:UserController )
	{
		this.userCtrl = userCtrl;
	}

	public async ListRooms() : Promise<SimpleRoom[]>
	{
		let simpleRoomDataArray = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "list"
		} ) as any[];

		return simpleRoomDataArray.map( srd => new SimpleRoom( srd ) );
	}

	public async CreateRoom( name:string,password:string ) : Promise<Room>
	{
		assert( this.userCtrl.IsLoggedIn(),"creating room when not logged in!" );
		let roomData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "create",
			"name" : name,
			"password" : password
		} );

		return new Room( roomData.id,roomData.name,roomData.gameId,roomData.players,this.userCtrl.GetUserId() );
	}
}