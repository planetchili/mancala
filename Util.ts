import * as $ from "jquery";

export function in_range( x : number,min : number,max :number ) : boolean
{
    return (x >= min) && (x <= max);
}

export async function post( url : string,params : object ) : Promise<object>
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