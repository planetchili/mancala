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
}