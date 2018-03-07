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

		return new Room( roomData,this.userCtrl.GetUserId() );
	}

	public async JoinRoom( sroom:SimpleRoom,password:string ) : Promise<Room>
	{
		assert( this.userCtrl.IsLoggedIn(),"joining room when not logged in!" );
		let roomData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "join",
			"roomId" : sroom.id,
			"password" : password
		} );

		return new Room( roomData,this.userCtrl.GetUserId() );
	}

	public async GetRoomIfJoined() : Promise<Room|null>
	{
		assert( this.userCtrl.IsLoggedIn(),"getting room when not logged in!" );
		let roomData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "check"
		} );		
		// service returns empty object if not currently joined, so first test if property exists
		return ('id' in roomData) ?
			new Room( roomData,this.userCtrl.GetUserId() ) :
			null;
	}

	public async LeaveRoom( room:Room ) : Promise<void>
	{
		assert( this.userCtrl.IsLoggedIn(),"leaving room when not logged in!" );
		await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "leave",
			"roomId" : room.GetId()
		} );
	}
}