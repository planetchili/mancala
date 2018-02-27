import * as assert from "assert";
import * as Util from "./Util";

export class Side
{
    private index : number;
    public constructor( index:number )
    {
        assert( Util.in_range( index,0,1 ),"Out of range in Side ctor" );
        this.index = index;
    }
    public static Top() : Side
    {
        return new Side( 0 );
    }
    public static Bottom() : Side
    {
        return new Side( 1 );
    }
    public IsTop() : boolean
    {
        return this.index == 0;
    }
    public IsBottom() : boolean
    {
        return this.index == 1;
    }
    public GetOpposite() : Side
    {
        return new Side( 1 - this.index );
    }
    public GetIndex() : number
    {
        return this.index;
    }
    public Equals( other : Side ) : boolean
    {
        return this.index === other.index;
    }
}