import Board from "./Board";
import Pot from "./Pot";
import Side from "./Side";
import * as assert from "assert";
import * as Util from "./Util";
import AnimationAction from "./AnimationAction";
import WinState from "./WinState";
import BoardView from "./BoardView";

export default class Game
{
	private id : number;
	private roomId : number;
	private board : Board;
	private winState : WinState;
	private ourSide : Side;
	private activeSide : Side;
	private turn : number;
	private opponentPresent : boolean;
	private players : { name:string,id:number }[];

	public constructor( id:number,roomId:number,gameData:any )
	{
		this.id = id;
		this.roomId = roomId;
		this.board = new Board( gameData.board );
		this.winState = gameData.winState as WinState;
		this.ourSide = new Side( gameData.ourSide );
		this.activeSide = new Side( gameData.activeSide );
		this.turn = gameData.turn;
		this.opponentPresent = gameData.opponentPresent;
		this.players = gameData.players;
	}

	public GetOurSide() : Side
	{
		return this.ourSide;
	}

	public GetActiveSide() : Side
	{
		return this.activeSide;
	}

	public GetBoardState() : number[]
	{
		return this.board.ToArray();
	}

	// returns sequence and promise for result state from server
	public DoMove( move:Pot ) : { seq:AnimationAction[],promise:Promise<void> }
	{
		// make sure that pot side is our side is active side
		assert( this.ourSide.equals( this.activeSide ),"domove not our turn" );
		assert( move.GetSide().equals( this.ourSide ),"domove taking from enemy pot" );
		// send command non-blocking, update game after response comes in
		const promise = Util.post( "../manserv/GameController.php",
		{
			"cmd" : "move",
			"pot" : move.GetIndex(),
			"gameId" : this.id
		} )
		.then( ( result:any ) =>
		{
			this.WriteUpdate( result.state );
		} );
		// return promise and result data
		return { seq: this.board.DoMove( move,this.activeSide ).seq,promise: promise };
	}

	private WriteUpdate( state:any ) : void
	{
		// verify that server state matches what was calculated
		assert( this.board.ToArray().every( ( pot_c,i ) => pot_c === parseInt( state.board[i] ) ),"states do not match after move processing" );
		// update the game state variables
		this.winState = state.winState;
		this.activeSide = new Side( state.activeSide );
		this.turn = state.turn;
		this.opponentPresent = state.opponentPresent;
	}

	// returns true when turn is our turn
	public async Update() : Promise<AnimationAction[]>
	{
		// request updated info
		const update = await Util.post( "../manserv/GameController.php",
		{
			"cmd" : "update",
			"turn" : this.turn,
			"gameId" : this.id,
			"winState" : this.winState,
			"roomId" : this.roomId
		} );
		// write state if not up to date with server (execute moves & generate animations too)
		let actions : AnimationAction[] = [];
		if( !update.upToDate )
		{
			for( let move of update.history )
			{
				// TODO: the passing in / updating of the active side here might need some work
				const seq = this.board.DoMove( new Pot( parseInt( move.pot ) ),this.ourSide.GetOpposite() ).seq;
				actions = actions.concat( seq );
			}
			this.WriteUpdate( update.state );
		}
		// return generate animations
		return actions;
	}
}