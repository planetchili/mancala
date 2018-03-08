import * as assert from "assert";
import * as Util from "./Util";
import Game from "./Game";
import Player from "./Player";

export default class Room
{
	private id : number;
	private name : string;
	private gameId : number|null;
	private players : Player[] = [];
	private userId : number;
	private valid : boolean;

	public constructor( data:any,userId:number )
	{
		this.WriteData( data );
		this.userId = userId;
		this.valid = true;
	}

	private WriteData( data:any ) : boolean
	{
		let changed = false;

		if( this.id !== data.id )
		{
			changed = true;
		}
		this.id = data.id;

		if( this.name !== data.name )
		{
			changed = true;
		}
		this.name = data.name;

		if( this.gameId !== data.gameId )
		{
			changed = true;
		}
		this.gameId = data.gameId;

		// construct Player objects from server data
		const players = (data.players as any[]).map( (data:any) =>
			new Player( data.id,data.name,data.isOwner,data.isReady )
		);
		if( players.length !== this.players.length ||
			!players.every( (p,i) => p.equals( this.players[i] ) ) )
		{
			changed = true;
		}
		this.players = players;

		return changed;
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

	public async Update() : Promise<boolean>
	{
		assert( this.valid,"Tried use invalid room!" );
		let roomData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "update",
			"roomId" : this.id
		} );

		return this.WriteData( roomData );
	}

	public GetSelf() : Player
	{
		assert( this.valid,"Tried use invalid room!" );
		return this.players.find(( player:Player ) =>
		{
			return player.GetId() === this.userId;
		} ) as Player;
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

	public async Ready() : Promise<boolean>
	{
		assert( this.valid,"Tried use invalid room!" );
		assert( !this.GetSelf().IsReady(),"Already ready in room!" );
		let newStateData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "ready",
			"roomId" : this.id
		} );

		this.WriteData( newStateData );
		return this.IsEngaged();
	}

	// TODO: what if other player readies and game starts after after request init before completes?
	// (service returns state we chack it and this func returns flag maybe?)
	public async Unready() : Promise<void>
	{
		assert( this.valid,"Tried use invalid room!" );
		assert( this.GetSelf().IsReady(),"Not readied in room!" );
		let newStateData = await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "unready",
			"roomId" : this.id
		} );

		this.WriteData( newStateData );
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

	public async GetGame() : Promise<Game>
	{
		assert( this.gameId != null,"tried to get game when null" );
		let gameData = await Util.post( "../manserv/GameController.php",
		{
			"cmd" : "query",
			"roomId" : this.id,
			"gameId" : this.gameId
		} );
		return new Game( this.gameId as number,this.id,gameData );
	}

	public async QuitGame() : Promise<void>
	{
		assert( this.gameId != null,"tried to quit game when null" );
		await Util.post( "../manserv/RoomController.php",
		{
			"cmd" : "quitgame",
			"roomId" : this.id
		} );
		await this.Update();
	}

	public IsEngaged() : boolean
	{
		return this.gameId !== null;
	}

	public IsReadyToEngage() : boolean
	{
		return this.GetPlayerCount() === 2 &&
			this.GetPlayers().every( (player:Player) => player.IsReady() );
	}
}