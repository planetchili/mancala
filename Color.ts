export default class Color
{
	public r : number;
	public g : number;
	public b : number;
	public a : number;

	public constructor( r:number,g:number,b:number,a:number )
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	public LerpTo( dest:Color,alpha:number ) : Color
	{
		const acomp = 1 - alpha;
		return new Color(
			this.r * acomp + dest.r * alpha,
			this.g * acomp + dest.g * alpha,
			this.b * acomp + dest.b * alpha,
			this.a * acomp + dest.a * alpha
		);
	}

	public toString() : string
	{
		return "rgba(" + 
			Math.floor( this.r ) + "," +
			Math.floor( this.g ) + "," +
			Math.floor( this.b ) + "," +
			this.a +
		")";
	}
}