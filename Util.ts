import * as $ from "jquery";

export function in_range( x:number,min:number,max:number ) : boolean
{
    return (x >= min) && (x <= max);
}

export function rand( max_inclusive:number ) : number
{
    return Math.floor( Math.random() * max_inclusive ) + 1;
}

export async function post( url:string,params:object ) : Promise<any>
{
        var response = await $.post( url,params )
        .fail( ( jqXHR,textStatus,errorThrown ) =>
        {
            throw new Error( "$.post ajax failed: " + textStatus + " % " + errorThrown )
        } );

		if( response.status.isFail )
		{			
			throw new Error( "$.post failed, server returned: " + response.status.message );
        }
        
        return response.payload;
}