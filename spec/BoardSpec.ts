import Board from "../Board";
import Pot from "../Pot";
import Side from "../Side";
import WinState from "../WinState";
import AnimationAction from "../AnimationAction";
import * as assert from "assert";

describe("Board Tests",() =>
{
    it("have correct state for top/bottom cross",() =>
    {
		let b = Board.MakeFresh();
		b.DoMove( Pot.FromSideOffset( Side.Top(),4 ),Side.Top() );		
        expect( b.ToArray() ).toEqual( [4,4,4,4,0,5,1,5,5,4,4,4,4,0] )
    });
});