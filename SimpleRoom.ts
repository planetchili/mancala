export default class SimpleRoom
{
	public id : number;
	public name : string;
	public locked : boolean;
	public engaged : boolean;
	public playerNames : string[];

	public constructor( simpleRoomData:any )
	{
		this.id = simpleRoomData.id;
		this.name = simpleRoomData.name;
		this.engaged = simpleRoomData.engaged;
		this.locked = simpleRoomData.locked;
		this.playerNames = simpleRoomData.players;
	}

	public equals( rhs:SimpleRoom ) : boolean
	{
		return this.id === rhs.id &&
			this.name === rhs.name &&
			this.engaged == rhs.engaged &&
			this.locked === rhs.locked &&
			this.playerNames.every( (name:string,i:number) => name === rhs.playerNames[i] );
	}
}