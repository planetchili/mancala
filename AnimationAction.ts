import Pot from "./Pot";

export default class AnimationAction
{
	public source : Pot;
	public destination : Pot;

	public constructor( source:Pot,destination:Pot )
	{
		this.source = source;
		this.destination = destination;
	}

	public equals( rhs:AnimationAction ) : boolean
	{
		return this.source.equals( rhs.source ) && 
			this.destination.equals( rhs.destination );
	}
}