/**
	Windows organize data for UI elements
*/
class Window {
    constructor(pSelector, pCloseable) {

        // The DOM element pertaining to this Window
        this.element = $(pSelector)[0];

        // This window's header
        this.header = $(pSelector + " > .ui-window-header")[0];
        
        // This window's body
        this.body = $(pSelector + "> .ui-window-body")[0];

        // This window's minimize button
        
    }
}