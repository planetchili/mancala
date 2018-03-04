import * as $ from "jquery";

export default class Point
{
	public x : number;
	public y : number;

	public constructor( x:number,y:number )
	{
		this.x = x;
		this.y = y;
	}

	public Plus( rhs:Point ) : Point
	{
		return new Point(
			this.x + rhs.x,
			this.y + rhs.y
		);
	}

	public Minus( rhs:Point ) : Point
	{
		return new Point(
			this.x - rhs.x,
			this.y - rhs.y
		);
	}

	public NormSq() : number
	{
		return this.x * this.x + this.y * this.y;
	}

	public Norm() : number
	{
		return Math.sqrt( this.NormSq() );
	}

	public DistTo( dest:Point ) : number
	{
		return dest.Minus( this ).Norm();
	}

	public static FromOffset( offset:JQuery.Coordinates ) : Point
	{
		return new Point( offset.left,offset.top );
	}
}