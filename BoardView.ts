import Pot from "./Pot";
import Point from "./Point";
import * as $ from "jquery";
import Color from "./Color";
import * as assert from "assert";
import * as Util from "./Util";
import AnimationAction from "./AnimationAction";

export default class BoardView
{
	private readonly beadSpacing : number = 20;
	private readonly beadMoveSpeed : number = 175;
	private readonly beadColors : Color[] = [
		new Color( 255,0,0,0.7 ),
		new Color( 0,255,0,0.7 ),
		new Color( 0,0,255,0.7 ),
		new Color( 255,255,0,0.7 ),
		new Color( 0,255,255,0.7 )
	];
	private nextBeadId : number = 0;
	private beadWidth : number;

	public constructor( state:number[] )
	{
		// sense the bead width and store it
		// TODO: maybe do something about this (DRY bead html and weird append/remove)
		const bead = $("<div>",{"class":"bead","id":"bead"+this.nextBeadId});
		$("body").append( bead );
		let beadElement = $("div.bead");
		this.beadWidth = beadElement.width() as number;
		beadElement.remove();

		// init beads
		for( let i = 0; i < 14; i++ )
		{
			const pot = new Pot( i );
			if( pot.IsMancala() )
			{
				continue;
			}

			for( let b = 0; b < 4; b++ )
			{
				this.SpawnBead( pot,this.beadColors[Util.rand( this.beadColors.length - 1 )] );
			}
		}
		// load state
		this.SetToState( state );
	}

	public async ReplayAnimation( actions:AnimationAction[] ) : Promise<void>
	{
		for( let action of actions )
		{
			await this.MoveBead( action.source,action.destination );
		}
	}

	public SetToState( state:number[] ) : void
	{
		assert( state.length === 14,"wrong # pots in state" );
		assert( state.reduce( (acc,cur) => acc + cur ) === 48,"wrong # beads in state" );
		// move all beads to body
		for( let bid = 0; bid < this.nextBeadId; bid++ )
		{
			this.GetElementFromBeadId( bid ).appendTo( $("body") );
		}

		// loop through all indices in state and place beads in order
		let bid = 0;
		for( let i = 0; i < 14; i++ )
		{
			const jqPot = this.GetElementFromPot( new Pot( i ) );
			for( let b = 0; b < state[i]; b++ )
			{
				const jqBead = this.GetElementFromBeadId( bid++ );
				jqBead.appendTo( jqPot );
			}
		}
	}

	public ToArray() : number[]
	{
		const bead_counts : number[] = [];
		for( let i = 0; i < 14; i++ )
		{
			const pot = new Pot( i );
			bead_counts.push( this.GetElementFromPot( pot ).children().length );
		}
		return bead_counts;
	}

	public async MoveBead( src:Pot,dest:Pot ) : Promise<void>
	{
		const jqSrcPot = this.GetElementFromPot( src );
		const jqDestPot = this.GetElementFromPot( dest );
		assert( jqSrcPot.length > 0 );
		const jqBead = jqSrcPot.children().first();

		const rel_end_pos = this.FindAvailableBeadOffset( dest );
		const abs_start_pos = Point.FromOffset( jqBead.offset() as JQuery.Coordinates );
		const abs_end_pos = Point.FromOffset( this.GetElementFromPot( dest ).offset() as JQuery.Coordinates )
			.Plus( rel_end_pos );
		
		this.SetBeadOffset( jqBead,abs_start_pos );
		await jqBead
			.appendTo( $("body") )
			.animate( {
				"left":abs_end_pos.x+"px",
				"top":abs_end_pos.y+"px"
			},this.beadMoveSpeed ).promise();
		jqBead.appendTo( jqDestPot );
		this.SetBeadOffset( jqBead,rel_end_pos );
	}

	public SpawnBead( pot:Pot,color:Color ) : void
	{
		const hi = color.LerpTo( new Color(255,255,255,0),0.8 );
		hi.a = 0.85;
		const lo = color.LerpTo( new Color(0,0,0,0),0.8 );
		lo.a = 0.85;
		const grad =  "radial-gradient(farthest-corner at 9px 9px," +
			hi + " 0%, " + hi + " 8%, " + color + " 30%, " +
			lo + " 90%)";
		
		const bead = $("<div>",{"class":"bead","id":"bead"+this.nextBeadId++});
		bead.css( "background-image",grad );
		this.SetBeadOffset( bead,this.FindAvailableBeadOffset( pot ) );
		this.GetElementFromPot( pot ).append( bead );		
	}

	private FindAvailableBeadOffset( pot:Pot ) : Point
	{
		const potWidth = this.GetElementFromPot( pot ).width() as number;
		const beadOffsets = this.GetBeadOffsets( pot );
		let bs = this.beadSpacing;

		while( true )
		{
			const candidateOffset = this.GenerateOffsetInscribed( potWidth,this.beadWidth );
			if( beadOffsets.every( ( p:Point ) => p.DistTo( candidateOffset ) > bs ) )
			{
				return candidateOffset;
			}
			else
			{
				bs--;
			}
		}
	}

	// bead offset within circle inscribed in square
	private GenerateOffsetInscribed( potWidth:number,beadWidth:number ) : Point
	{
		const theta = Math.PI * (2 * Math.random() - 1);
		const r = (potWidth / 2 - beadWidth / 2) * Math.random();
		return new Point( 
			Math.floor( r * Math.cos( theta ) ) + potWidth / 2 - beadWidth / 2,
			Math.floor( r * Math.sin( theta ) ) + potWidth / 2 - beadWidth / 2
		);
	}

	private GetBeadOffsets( pot:Pot ) : Point[]
	{
		const jqPot = this.GetElementFromPot( pot );
		const potOffset = Point.FromOffset( jqPot.offset() as JQuery.Coordinates );
		const positions : Point[] = [];
		jqPot.children().each(function()
		{
			// all beads have same width/height, so just compare offsets
			positions.push( 
				Point.FromOffset( $(this).offset() as JQuery.Coordinates )
				.Minus( potOffset )
			);
		} );
		return positions;
	}

	private GetElementFromPot( pot:Pot ) : JQuery<HTMLElement>
	{
		return $("#pt"+pot.GetIndex());
	}

	private GetElementFromBeadId( beadId:number ) : JQuery<HTMLElement>
	{
		return $("#bead"+beadId);
	}

	private SetBeadOffset( bead:JQuery<HTMLElement>,offset:Point ) : void
	{
		$(bead).css( {
			"top":offset.y + "px","left":offset.x + "px"
		} );  
	}

	private GetPotOffset( pot:Pot ) : Point
	{
		return Point.FromOffset( $(this.GetElementFromPot( pot )).offset() as JQuery.Coordinates );
	}

	public static GetPotFromElement( element:JQuery<HTMLElement> ) : Pot
	{
		let id = element.attr( "id" ) as string;
		assert( id.startsWith( "pt" ) );
		return new Pot( parseInt( id.substr( 2 ) ) );
	}

	public static GetBeadIdFromElement( element:JQuery<HTMLElement> ) : number
	{
		let id = element.attr("id") as string;
		assert( id.startsWith( "bead" ) );
		return parseInt( id.substr( 4 ) );
	}
}

