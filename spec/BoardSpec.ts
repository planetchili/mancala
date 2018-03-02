import Board from "../Board";
import Pot from "../Pot";
import Side from "../Side";
import WinState from "../WinState";
import AnimationAction from "../AnimationAction";
import * as assert from "assert";

describe("Board",() =>
{
    // top/bottom cross
    it("has correct state for top/bottom cross",() =>
    {
		let b = Board.MakeFresh();
		b.DoMove( Pot.FromSideOffset( Side.Top(),4 ),Side.Top() );		
        expect( b.ToArray() ).toEqual( [4,4,4,4,0,5,1,5,5,4,4,4,4,0] )
    });
    it("has correct sequence for top/bottom cross",() =>
    {
		let b = Board.MakeFresh();
        let res = b.DoMove( Pot.FromSideOffset( Side.Top(),4 ),Side.Top() );
        expect( res.seq ).toEqual( [
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ),Pot.FromSideOffset( Side.Top(),5 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ),Pot.FromSideOffset( Side.Bottom(),0 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ),Pot.FromSideOffset( Side.Bottom(),1 ) )
        ] );
    });
    it("has correct manacala result for top/bottom cross",() =>
    {
		let b = Board.MakeFresh();
        let res = b.DoMove( Pot.FromSideOffset( Side.Top(),4 ),Side.Top() );
        expect( res.isMan ).toBeFalsy();
    });
    
    // top mancala
    it("has correct state for top mancala",() =>
    {
		let b = Board.MakeFresh();
		b.DoMove( Pot.FromSideOffset( Side.Top(),2 ),Side.Top() );		
        expect( b.ToArray() ).toEqual( [4,4,0,5,5,5,1,4,4,4,4,4,4,0] )
    });
    it("has correct sequence for top mancala",() =>
    {
		let b = Board.MakeFresh();
        let res = b.DoMove( Pot.FromSideOffset( Side.Top(),2 ),Side.Top() );
        expect( res.seq ).toEqual( [
            new AnimationAction( Pot.FromSideOffset( Side.Top(),2 ),Pot.FromSideOffset( Side.Top(),3 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),2 ),Pot.FromSideOffset( Side.Top(),4 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),2 ),Pot.FromSideOffset( Side.Top(),5 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),2 ),Pot.FromSideOffset( Side.Top(),6 ) )
        ] );
    });
    it("has correct manacala result for top mancala",() =>
    {
		let b = Board.MakeFresh();
        let res = b.DoMove( Pot.FromSideOffset( Side.Top(),2 ),Side.Top() );
        expect( res.isMan ).toBeTruthy();
    });
    
    // top steal
    it("has correct state for top steal",() =>
    {
		let b = Board.MakeFresh();
		b.DoMove( Pot.FromSideOffset( Side.Top(),4 ),Side.Top() );
		b.DoMove( Pot.FromSideOffset( Side.Bottom(),0 ),Side.Bottom() );	
		b.DoMove( Pot.FromSideOffset( Side.Top(),0 ),Side.Top() );		
        expect( b.ToArray() ).toEqual( [0,5,5,5,0,5,8,0,0,5,5,5,5,0] )
    });
    it("has correct seq for top steal",() =>
    {
		let b = Board.MakeFresh();
		b.DoMove( Pot.FromSideOffset( Side.Top(),4 ),Side.Top() );
		b.DoMove( Pot.FromSideOffset( Side.Bottom(),0 ),Side.Bottom() );	
		let res = b.DoMove( Pot.FromSideOffset( Side.Top(),0 ),Side.Top() );		
        expect( res.seq ).toEqual( [
            new AnimationAction( Pot.FromSideOffset( Side.Top(),0 ),Pot.FromSideOffset( Side.Top(),1 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),0 ),Pot.FromSideOffset( Side.Top(),2 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),0 ),Pot.FromSideOffset( Side.Top(),3 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),0 ),Pot.FromSideOffset( Side.Top(),4 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ).GetOpposite(),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ).GetOpposite(),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ).GetOpposite(),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ).GetOpposite(),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ).GetOpposite(),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ).GetOpposite(),Pot.FromSideOffset( Side.Top(),6 ) ),
            new AnimationAction( Pot.FromSideOffset( Side.Top(),4 ),Pot.FromSideOffset( Side.Top(),6 ) )
        ] );
    });
});