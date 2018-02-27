import * as assert from "assert";
import * as Util from "./Util";
import Player from "./Player";

export default class Room
{
	private id : number;
	private name : string;
	private gameId : number|null;
	private players : Player[];
	private userId : number;
	private valid : boolean;

	public constructor( id:number,name:string,gameId:number|null,players:Player[],userId:number )
	{
		this.id = id;
		this.name = name;
		this.gameId = gameId;
		this.players = players;
		this.userId = userId;
		this.valid = true;
	}

	public GetId() : number
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.id;
	}

	public GetName() : string
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.name;
	}

	public GetGameId() : number
	{
		assert( this.valid,"Tried use invalid room!" );
		assert( this.gameId !== null,"Room has no engaged game!" );
		return this.gameId as number;
	}

	public GetPlayers() : Player[]
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.players;
	}

	public GetPlayerCount() : number
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.players.length;
	}

	public GetPlayerFromId( id:number ) : Player
	{
		assert( this.valid,"Tried use invalid room!" );
		let result = this.players.find(( player:Player ) => player.GetId() === id );
		assert( result !== undefined,"Player id does not exist in room!" );
		return result as Player;
	}

	public GetPlayerFromName( name:string ) : Player
	{
		assert( this.valid,"Tried use invalid room!" );
		let result = this.players.find(( player:Player ) => player.GetName() == name );
		assert( result !== undefined,"Player name does not exist in room!" );
		return result as Player;
	}

	public async Update() : Promise<void>
	{
		assert( this.valid,"Tried use invalid room!" );
		let roomData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "update",
			"roomId" : this.id
		} );

		this.players = roomData.players;
		this.gameId = roomData.gameId;
	}

	public GetSelf() : Player
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.players.find(( player:Player ) => player.GetId() === this.userId ) as Player;
	}

	public GetOpponent() : Player
	{
		assert( this.valid,"Tried use invalid room!" );
		assert( this.OpponentIsPresent(),"Tried to get opponent, none present!" );		
		return this.players.find(( player:Player ) => player.GetId() !== this.userId ) as Player;
	}

	public OpponentIsPresent() : boolean
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.GetPlayerCount() > 1;
	}

	public IsReady() : boolean
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.GetSelf().IsReady();
	}

	public async Ready() : Promise<void>
	{
		assert( this.valid,"Tried use invalid room!" );
		assert( !this.IsReady(),"Already ready in room!" );
		await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "ready",
			"roomId" : this.id
		} );
		this.GetSelf().Ready();
	}

	public async Unready() : Promise<void>
	{
		assert( this.valid,"Tried use invalid room!" );
		assert( this.IsReady(),"Not readied in room!" );
		await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "unready",
			"roomId" : this.id
		} );
		this.GetSelf().Unready();
	}

	public async Leave() : Promise<void>
	{
		assert( this.valid,"Tried use invalid room!" );
		await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "leave",
			"roomId" : this.id
		} );
		this.valid = false;
	}
}