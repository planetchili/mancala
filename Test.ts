
import * as $ from "jquery";

export class Test
{
    private msg : string;
    constructor( msg : string )
    {
        this.msg = msg;
    }
    public Do() : void
    {
        $("#shame").text(this.msg);
    }
    public Trial() : string
    {
        return this.msg + "@";
    }
}