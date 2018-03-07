import Pot from "./Pot";
import Side from "./Side";
import * as assert from "assert";
import * as Util from "./Util";
import AnimationAction from "./AnimationAction";
import WinState from "./WinState";

export default class Board
{
	private pots : number[];

	public DoMove( move:Pot,active_side:Side ) : { isMan:boolean,seq:AnimationAction[] }
	{
		assert( move.GetSide().equals( active_side ),'Cannot take from opponent pot' );
		assert( !move.IsMancala(),'Cannot take from mancala' );
		assert( this.GetPot( move ) != 0,'Cannot take from empty pot' );

		// animation sequence
		const seq : AnimationAction[] = [];
		// remove beads from move pot
		let beads = this.TakeAllPot( move );
		// sow all beads but last one
		for( var cur = move.GetNext( active_side ); beads > 1; beads--,
			cur = cur.GetNext( active_side ) )
		{
			this.IncrementPot( cur );
			seq.push( new AnimationAction( move,cur ) );
		}
		// last into pot animation
		seq.push( new AnimationAction( move,cur ) );
		// sow last bead & check for steal
		if( this.IncrementPot( cur ) == 1 && cur.GetSide().equals( active_side )
			&& !cur.IsMancala() )
		{
			// make da stuffs
			const mancala = Pot.FromSideOffset( active_side,6 );
			const opposite = cur.GetOpposite();
			// do da stuffs
			const stolen = this.TakeAllPot( opposite );
			this.SetPot( cur,0 );
			this.DumpInMancala( cur.GetSide(),stolen + 1 );
			// animate da stuffs
			for( let x = 0; x < stolen; x++ )
			{
				seq.push( new AnimationAction( opposite,mancala ) );
			}
			seq.push( new AnimationAction( cur,mancala ) );
		}
		// check for endgame situation
		const empty = this.GetEmptySide();
		if( empty.hasSide )
		{
			for( let i = 0; i < 6; i++ )
			{
				const sweepSide = (empty.emptySide as Side).GetOpposite()
				const mancala = Pot.FromSideOffset( sweepSide,6 );
				const sweepPot = Pot.FromSideOffset( sweepSide,i );
				const nBeads = this.TakeAllPot( sweepPot );
				for( let j = 0; j < nBeads; j++ )
				{
					seq.push( new AnimationAction( sweepPot,mancala ) );
				}
				this.DumpInMancala( sweepSide,nBeads );
			}
		}
		// return true if mancala and the bead move sequence
		return { isMan: cur.IsMancala(),seq: seq };
	}

	private GetEmptySide() : { hasSide:boolean,emptySide?:Side }
	{
		const checkSide = (side:Side) : boolean =>
		{
			for( let i = 0; i < 6; i++ )
			{
				if( this.GetPot( Pot.FromSideOffset( side,i ) ) !== 0 )
				{
					return false;
				}
			}
			return true;
		};

		if( checkSide( Side.Top() ) )
		{
			return { hasSide: true,emptySide: Side.Top() };
		}
		else if( checkSide( Side.Bottom() ) )
		{
			return { hasSide: true,emptySide: Side.Bottom() };
		}

		return { hasSide: false };
	}

	public CheckIfSideEmpty( side:Side ) : boolean
	{
		for( let offset = 0; offset < 6; offset++ )
		{
			if( this.GetPot( Pot.FromSideOffset( side,offset ) ) != 0 )
			{
				return false;
			}
		}
		return true;
	}

	/** Game must be over to call GetWinState() */
	public GetWinState() : WinState
	{
		assert( this.CheckIfSideEmpty( Side.Top() ) && 
			this.CheckIfSideEmpty( Side.Bottom() )
		);

		let mantop = this.GetPot( new Pot( 6 ) );
		let manbot = this.GetPot( new Pot( 13 ) );
		if( mantop > manbot )
		{
			return WinState.TopWins;
		}
		else if( manbot > mantop )
		{            
			return WinState.BottomWins;
		}
		return WinState.Tie;
	}

	public GetPot( pot:Pot ) : number
	{
		return this.pots[pot.GetIndex()];
	}

	public SetPot( pot:Pot,beads:number ) : void
	{
		assert( Util.in_range( beads,0,48 ),'Beads set must be 0~48' );
		this.pots[pot.GetIndex()] = beads;
	}

	public TakeAllPot( pot:Pot ) : number
	{
		let temp = this.GetPot( pot );
		this.SetPot( pot,0 );
		return temp;
	}

	public DumpInMancala( dump_side:Side,beads:number ) : number
	{
		let pot = Pot.FromSideOffset( dump_side,6 );
		let val = this.GetPot( pot ) + beads;
		this.SetPot( pot,val );
		return val;
	}

	public IncrementPot( pot:Pot ) : number
	{
		let val = this.GetPot( pot ) + 1;
		this.SetPot( pot,val );
		return val;
	}

	public static MakeFresh() : Board
	{
		return new Board( [
			4,4,4,4,4,4,0,
			4,4,4,4,4,4,0
		] );
	}

	public ToArray() : number[]
	{
		return this.pots;
	}

	public constructor( pots:number[] )
	{
		assert( pots.length == 14 );
		this.pots = pots;
	}
}