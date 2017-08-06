/**
	Windows organize data for UI elements
*/
class Window {
    constructor(pSelector, pCloseable) {

        // The DOM element pertaining to this Window
        this.element = document.querySelector(pSelector);

        // This window's header
        this.header = document.querySelector(pSelector + " > .ui-window-header");
        
        // This window's body
        this.body = document.querySelector(pSelector + "> .ui-window-body");

        // This window's minimize button
        
    }
}