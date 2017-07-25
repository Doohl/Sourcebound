var UI; // static UIManager container


/**
	The UI manager, handles rendering UI elements to the DOM
*/
class UIManager {
	constructor() {
        UI = this;
        
        /* Container of "Window" objects indexed by their string IDs  */
        UI.windows= {};

        /* Container of temporary windows */
		UI.tempWindows = [];
		
	}

	/**
		Called when the DOM is fully loaded
	*/
	initiate() {
		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', UI.resizeDOM, false);
		UI.resizeDOM();
		
		// Stop generic mouse events from propagating up to the document
		$('.ui-window').mousedown(event => {
			event.stopPropagation();
		}).on('mousewheel', event => {
			event.stopPropagation();	
		});

		
		// Initialize the starting windows
		UI.windows = {
			'newsfeed': new NewsfeedWindow('#window-Newsfeed')
		};

		this.windows.newsfeed.clearNews(GameM.universeClock);

		this.addNews("Welcome back, Emperor.", null, GameM.universeClock, 'self', false);
	}

	/**
		Handle entire DOM resizing
	*/
	resizeDOM() {
		RenderM.renderer.resize(window.innerWidth, window.innerHeight);
	}



	/*
		Macros for common UI functions
	*/

	addNews(pTitle, pInfo, pDate, pCategory, pIsUrgent) {
		UI.windows.newsfeed.addNews(pTitle, pInfo, pDate, pCategory, pIsUrgent);
	}
    

}
new UIManager();
