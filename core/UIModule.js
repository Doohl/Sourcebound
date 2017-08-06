/**
 * The UI Module:
 * 
 * Responsible for drawing to the canvas and handling all the
 * related logic.
 * 
 * @module Sourcebound/UIModule
 */

var UIM = (function() {

	/** Container of Window objects indexed by their ID strings */
	_windows = [];

	/**
	 * Called when the window resizes
	 */
	function _onWindowResize() {
		let canvas = RenderM.getCanvas();
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		//renderFrameCanvas();
	}

	return {

		/**
		 * Called when the DOM is ready
		 */
		onDOMReady() {

			// resize the canvas to fill browser window dynamically
			window.addEventListener('resize', _onWindowResize, false);
			_onWindowResize();
			
			// Stop generic mouse events from propagating up to the document
			let windows = document.querySelectorAll('.ui-window');
			for(let i = 0, len = windows.length; i < len; i++) {
				let element = windows[i];
				element.addEventListener('mousedown', event => {
					event.stopPropagation();
				});
				element.addEventListener('wheel', event => {
					event.stopPropagation();
				});
			}

			// Initialize the starting windows
			_windows = {
				'newsfeed': new NewsfeedWindow('#window-Newsfeed')
			};
			_windows.newsfeed.clearNews(LogicM.getUniverseClock());

			this.addNews("Welcome back, Emperor.", null, LogicM.getUniverseClock(), 'self', false);
		},

		/**
		 * Add a new news article
		 * @param {string} title 
		 * @param {string} info 
		 * @param {number} date 
		 * @param {string} category 
		 * @param {boolean} isUrgent 
		 */
		addNews(title, info, date, category, isUrgent) {
			_windows.newsfeed.addNews(title, info, date, category, isUrgent);
		}


	};

}());
