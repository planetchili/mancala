import * as assert from "assert";

export default class Player
{
	private id : number;
	private name : string;
	private isOwner : boolean;
	private isReady : boolean;

	public constructor( id:number,name:string,isOwner:boolean,isReady:boolean )
	{
		this.id = id;
		this.name = name;
		this.isOwner = isOwner;
		this.isReady = isReady;
	}

	public GetId() : number
	{
		return this.id;
	}

	public GetName() : string
	{
		return this.name;
	}

	public IsOwner() : boolean
	{
		return this.isOwner;
	}

	public IsReady() : boolean
	{
		return this.isReady;
	}
}