import * as assert from "assert";
import Side from "./Side";
import * as Util from "./Util";

export default class Pot
{
	private index : number;
	
    public IsMancala() : boolean
    {
        return (this.index + 1) % 7 == 0;
    }

    public GetSide() : Side
    {
        return new Side( Math.floor( this.index / 7 ) );
    }

    public GetIndex() : number
    {
        return this.index;
    }

    public GetNext( activeSide:Side ) : Pot
    {
        assert( !(!this.GetSide().equals( activeSide ) && this.IsMancala()),'Next origin cannot be other mancala' );
        if( this.GetOffset() == 5 && !this.GetSide().equals( activeSide ) )
        {
            return new Pot( (this.index + 2) % 14 );
        }
        else
        {
            return new Pot( (this.index + 1) % 14 );
        }
    }

    public GetOffset() : number
    {
        return this.index % 7;
    }

    public GetOpposite() : Pot
    {
        assert( !this.IsMancala(),'Cannot get opposite of mancala' );
        return new Pot( 12 - this.index );
    }
    
    public constructor( index:number )
    {
        assert( Util.in_range( index,0,13 ),'Pot index must be 0~13' );
        this.index = index;
    }

    public equals( rhs:Pot ) : boolean
    {
        return this.index === rhs.index;
    }

    public static FromSideOffset( side:Side,offset:number ) : Pot
    {
        assert( Util.in_range( offset,0,6 ),'Offset must be 0~6' );
        return new Pot( side.GetIndex() * 7 + offset );
    }
}