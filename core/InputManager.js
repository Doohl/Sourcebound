var inputM; // static InputManager container

/**
	The input manager, waits for keyboard + mouse events
*/
class InputManager {
	constructor() {
		inputM = this;

		/* Table indexing keyCodes and the time they were pressed. Will only remain for as long as held */
		inputM.keysHolding = {};

		/* Reference to the current movement interval. Defined if the camera is actively moving */
		inputM.movementInterval = undefined;

		/* True if currently holding the mouse down */
		inputM.holdingMouse = false;

		/* Mouse coordinates */
		inputM.mouseX = undefined;
		inputM.mouseY = undefined;

		/* A list of keys and their respective commands */
		inputM.keyMap = {
			'west': [65, 37],
			'east': [68, 39],
			'north': [87, 38],
			'south': [83, 40],
			'pauseToggle': [107],
			'zoomOut': [109]
		};
	}

	/**
		Called when the DOM is fully loaded
			- Begin listening for input events
	*/
	initiate() {
		// Listen for keydown events
		$(document).keydown(event => {
			for(let command in inputM.keyMap) {
				if(inputM.keyMap[command].indexOf(event.keyCode) !== -1) {
					inputM.keysHolding[command] = true;
					break;
				}
			}
			// Attempt movement
			if(!inputM.movementInterval) {
				inputM.movementLoop();
			}
		// Listen for keyup events
		}).keyup(event => {
			for(let command in inputM.keyMap) {
				if(inputM.keyMap[command].indexOf(event.keyCode) !== -1) {
					inputM.keysHolding[command] = false;
					if(inputM[command]) {
						inputM[command]();
					}
					break;
				}
			}
		// Listen for mousewheel events
		}).on('mousewheel', event => {
			if(event.deltaY > 0) {
				const oldReal = screenToReal({'x': inputM.mouseX, 'y': inputM.mouseY});
				inputM.zoomIn(1.25);
				const curReal = screenToReal({'x': inputM.mouseX, 'y': inputM.mouseY});
				const xDiff = oldReal.x - curReal.x;
				const yDiff = oldReal.y - curReal.y;
				renderM.xPos += xDiff;
				renderM.yPos += yDiff;
			} else if(event.deltaY < 0) {
				const oldReal = screenToReal({'x': inputM.mouseX, 'y': inputM.mouseY});
				inputM.zoomOut(1.25);
				const curReal = screenToReal({'x': inputM.mouseX, 'y': inputM.mouseY});
				const xDiff = oldReal.x - curReal.x;
				const yDiff = oldReal.y - curReal.y;
				renderM.xPos += xDiff;
				renderM.yPos += yDiff;
			}
		// Listen for mouse events
		}).mousedown(event => {
			inputM.holdingMouse = true;
		}).mousemove(event => {
			if(inputM.holdingMouse && inputM.mouseX !== undefined && inputM.mouseY !== undefined) {
				const oldReal = screenToReal({'x': inputM.mouseX, 'y': inputM.mouseY});
				const curReal = screenToReal({'x': event.pageX, 'y': event.pageY});
				const xDiff = oldReal.x - curReal.x;
				const yDiff = oldReal.y - curReal.y;
				renderM.xPos += xDiff;
				renderM.yPos += yDiff;
			}
			inputM.mouseX = event.pageX;
			inputM.mouseY = event.pageY;
		}).mouseup(event => {
			inputM.holdingMouse = false;
		});
	}

	/**
		Move every 5ms if keys are being pressed
	*/
	movementLoop() {
		if(inputM.movementInterval) {
			return;
		}
		inputM.movementInterval = setInterval(() => {
			let moved = false;
			let movement = {'x': 0, 'y': 0};

			if(inputM.keysHolding['north']) {
				movement.y = -1;
				moved = true;
			}
			if(inputM.keysHolding['south']) {
				movement.y = 1;
				moved = true;
			}
			if(inputM.keysHolding['east']) {
				movement.x = 1;
				moved = true;
			}
			if(inputM.keysHolding['west']) {
				movement.x = -1;
				moved = true;
			}
			renderM.moveCamera(movement);

			if(!moved) {
				clearInterval(inputM.movementInterval);
				inputM.movementInterval = undefined;
			}
		}, 10);
	}

	/**
		Increase Zoom factor
	*/
	zoomIn(factor) {
		factor = factor || 1.5;
		renderM.zoom *= factor;
		if(renderM.zoom > 1) {
			renderM.zoom = 1;
		}
		console.log("zoom factor: " + renderM.zoom);
	}

	/**
		Decrease zoom factor
	*/
	zoomOut(factor) {
		factor = factor || 1.5;
		renderM.zoom /= factor;
		console.log("zoom factor: " + renderM.zoom);
	}

	pauseToggle() {
		gameM.paused = !gameM.paused;
	}
}
inputM = new InputManager();
