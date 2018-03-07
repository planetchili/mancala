import * as assert from "assert";
import * as $ from "jquery";

export default abstract class Window
{
	private static activeWindow : Window|null = null;

	public abstract Show() : void;
	public abstract Hide() : void;

	protected static _Show( selector:string,newActive:Window ) : void
	{
		if( Window.HasActive() )
		{
			(Window.activeWindow as Window).Hide();
		}
		$(selector).fadeIn( 300 );
		Window.activeWindow = newActive;
	}

	protected static _Hide( selector:string ) : void
	{
		$(selector).fadeOut( 300 );
		Window.activeWindow = null;
	}

	// protected static SetActiveWindow( window:Window ) : void
	// {
	// 	Window.activeWindow = window;
	// }
	
	// protected static GetActiveWindow() : Window
	// {
	// 	assert( Window.activeWindow !== null,"tried to get null activewindow" );
	// 	return Window.activeWindow as Window;
	// }

	private static HasActive() : boolean
	{
		return Window.activeWindow !== null;
	}
}