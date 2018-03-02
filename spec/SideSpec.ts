import Side from "../Side";
import * as assert from "assert";

describe("Side Tests",() =>
{
    it("should have correct indices for top and bottom",() =>
    {
        expect( Side.Top().GetIndex() ).toEqual( 0 );
        expect( Side.Bottom().GetIndex() ).toEqual( 1 );
    });

    it("should give good equals comparisons",() =>
    {
        expect( new Side( 0 ).equals( Side.Top() ) ).toBe( true );
        expect( new Side( 1 ).equals( Side.Bottom() ) ).toBe( true );
        expect( new Side( 0 ).equals( Side.Bottom() ) ).toBe( false );
    });

    it("should throw exception on bad ctor params",() =>
    {
        expect( () => new Side( 69 ) ).toThrowError( assert.AssertionError );
    });

    it("should give opposite side",() =>
    {
        expect( Side.Top().GetOpposite().GetIndex() ).toEqual( Side.Bottom().GetIndex() );
        expect( Side.Bottom().GetOpposite().GetIndex() ).toEqual( Side.Top().GetIndex() );
    });
});