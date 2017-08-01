var LEFT_MOUSE = 0,
	MIDDLE_MOUSE = 1,
	RIGHT_MOUSE = 2;

/**
 * The Input Module:
 * 
 * Handles keyboard & mouse events, organizes the keymap structure
 * 
 * @module Sourcebound/InputModule
 */

var InputM = (function() {
	
	/** Container indexing currently-held keycodes and the time of their initial press */
	var _keysHolding = [];

	/** Container indexing currently-held mouse buttons and the time of their initial press */
	var _mouseHolding = [];

	/** Current x coordinate of the mouse on the screen */
	var _xPos = undefined;

	/** Current y coordinate of the mouse on the screen */
	var _yPos = undefined;

	/** A list of keys and their respective commands */
	var _keyMap = {
		west: 				[65, 37],		// [a, left]
		east: 				[68, 39],		// [d, right]
		north: 				[87, 38],		// [w, up]
		south: 				[83, 40],		// [s, down]
		pauseToggle: 		[107],			// [numpad +]
		zoomOut: 			[109],			// [numpad -]
		test: 				[84] 			// [T] - debug key, remove
	};

	/** How many mouse movements have been done */
	var _mouseMoved = 0;

	/** 
	 * Handles any document 'mousedown' events
	 * @param {MouseEvent} event
	 * 		The mouse event captured
	 */
	function _onMouseDown(event) {
		_mouseHolding[event.button] = Date.now();
		if(event.button === LEFT_MOUSE) {
			_mouseMoved = 0;
		}
	}

	/**
	 * Handles any document 'mouseup' events
	 * @param {MouseEvent} event
	 * 		The mouse event captured 
	 */
	function _onMouseUp(event) {
		_mouseHolding[event.button] = 0;
		if(event.button === LEFT_MOUSE) {
			_mouseMoved = 0;
		}
	}

	/**
	 * Handles any document 'mousemove' events
	 * @param {MouseEvent} event
	 * 		The mouse event captured
	 */
	function _onMouseMove(event) {
		const newX = event.pageX,
			newY = event.pageY;

		/* Move the camera based on real coordinate differences */
		if(_mouseHolding[LEFT_MOUSE] && _xPos !== undefined) {
			const canvasCenterX = window.innerWidth / 2,
				canvasCenterY = window.innerHeight / 2,
				camera = RenderM.getCamera(),
				zoom = RenderM.getZoom();

			let oldRealX = ((camera.xPos * zoom) + (_xPos - canvasCenterX)) / zoom,
				oldRealY = ((camera.yPos * zoom) + (_yPos - canvasCenterX)) / zoom,
				newRealX = ((camera.xPos * zoom) + (newX - canvasCenterX)) / zoom,
				newRealY = ((camera.yPos * zoom) + (newY - canvasCenterX)) / zoom;
			
			RenderM.moveCamera(oldRealX - newRealX, oldRealY - newRealY);
		}
		_mouseMoved++;

		_xPos = newX;
		_yPos = newY;
	}

	/**
	 * Handles any document 'wheel' events
	 * @param {MouseEvent} event
	 * 		The mouse event captured
	 */
	function _onWheel(event) {

		// Pivot point
		let pivotPoint = {
			xPos: _xPos,
			yPos: _yPos
		};

		if(event.deltaY > 0) {
			_zoomOut(1.25, pivotPoint);
		} else if(event.deltaY < 0) {
			_zoomIn(1.25, pivotPoint);
		}
	}

	function _zoomIn(factor, pivotPoint) {
		RenderM.setZoom( Math.min(RenderM.getZoom() * factor, 1), pivotPoint);
	}

	function _zoomOut(factor, pivotPoint) {
		RenderM.setZoom(RenderM.getZoom() / factor, pivotPoint);
	}

	// Begin defining exports
	return {

		/**
		 * Get the coordinates of the player's mouse
		 * @return {Point}
		 * 		The current screen coordinates of the player's mouse
		 */
		getMouse: function() {
			return {
				xPos: _xPos,
				yPos: _yPos
			};
		},

		/**
		 * Called when the DOM is ready
		 */
		onDOMReady: function() {
			/* Begin listening for mouse events in the document */
			document.addEventListener('mousedown', _onMouseDown);
			document.addEventListener('mouseup', _onMouseUp);
			document.addEventListener('mousemove', _onMouseMove);
			document.addEventListener('wheel', _onWheel);
		}
	};

}());
