var InputM; // static InputManager container

/**
	The input manager, waits for keyboard + mouse events
*/
class InputManager {
	constructor() {
		InputM = this;

		/* Table indexing keyCodes and the time they were pressed. Will only remain for as long as held */
		InputM.keysHolding = {};

		/* Reference to the current movement interval. Defined if the camera is actively moving */
		InputM.movementInterval = undefined;

		/* True if currently holding the mouse down */
		InputM.holdingMouse = false;

		/* Mouse coordinates */
		InputM.mouseX = undefined;
		InputM.mouseY = undefined;

		/* A list of keys and their respective commands */
		InputM.keyMap = {
			'west'				: [65, 37],		// [a, left]
			'east'				: [68, 39],		// [d, right]
			'north'				: [87, 38],		// [w, up]
			'south'				: [83, 40],		// [s, down]
			'pauseToggle'		: [107],		// [numpad +]
			'zoomOut'			: [109],		// [numpad -]
			'test'				: [84] 			// [T] - debug key, remove
		};
	}

	/**
	 * Handles RenderM._stage 'mousedown' event 
	 * 
	 * @param {event} event The standard mouse event
	 */
	onMouseDown(event) {
		InputM.holdingMouse = true;
		InputM.mouseMoved = 0; // how many mouse movements have been done
	}

	/**
	 * Handles RenderM._stage 'mouseup' event 
	 * 
	 * @param {event} event The standard mouse event
	 */
	onMouseUp(event) {
		InputM.holdingMouse = false;
		InputM.mouseMoved = 0;
	}

	/**
	 * Handles RenderM._stage 'mousemove' event 
	 * 
	 * @param {event} event The standard mouse event
	 */
	onMouseMove(event) {
		if(InputM.holdingMouse && InputM.mouseX !== undefined && InputM.mouseY !== undefined) {
			const oldReal = screenToReal({'x': InputM.mouseX, 'y': InputM.mouseY});
			const curReal = screenToReal({'x': event.pageX, 'y': event.pageY});
			const xDiff = oldReal.x - curReal.x;
			const yDiff = oldReal.y - curReal.y;
			RenderM.moveCameraPos(xDiff, yDiff);
		}
		InputM.mouseMoved++;
		InputM.mouseX = event.pageX;
		InputM.mouseY = event.pageY;
	}

	onMouseWheel(event) {
		if(event.deltaY > 0) {
			InputM.zoomOut(1.25);
		} else if(event.deltaY < 0) {
			InputM.zoomIn(1.25);
		}
	}

	/**
		Called when the DOM is fully loaded
			- Begin listening for input events
	*/
	initiate() {

		// Begin listening for mouse events in the document
		document.addEventListener('mousedown', InputM.onMouseDown);
		document.addEventListener('mouseup', InputM.onMouseUp);
		document.addEventListener('mousemove', InputM.onMouseMove);
		document.addEventListener('wheel', InputM.onMouseWheel);

		/*


		// Listen for keydown events
		$(document).keydown(event => {
			for(let command in InputM.keyMap) {
				if(InputM.keyMap[command].indexOf(event.keyCode) !== -1) {
					InputM.keysHolding[command] = true;
					break;
				}
			}
			// Attempt movement
			if(!InputM.movementInterval) {
				InputM.movementLoop();
			}
		// Listen for keyup events
		}).keyup(event => {
			for(let command in InputM.keyMap) {
				if(InputM.keyMap[command].indexOf(event.keyCode) !== -1) {
					InputM.keysHolding[command] = false;
					if(InputM[command]) {
						InputM[command]();
					}
					break;
				}
			}
		// Listen for mousewheel events
		}).on('mousewheel', event => {
			const oldReal = screenToReal({'x': InputM.mouseX, 'y': InputM.mouseY});

			if(event.deltaY > 0) {
				InputM.zoomIn(1.25);
			} else if(event.deltaY < 0) {
				InputM.zoomOut(1.25);
			}

			// If the player has no target, center the zoom around their cursor
			if(!GameM.target) {
				const curReal = screenToReal({'x': InputM.mouseX, 'y': InputM.mouseY});
				const xDiff = oldReal.x - curReal.x;
				RenderM.xPos += xDiff;
				const yDiff = oldReal.y - curReal.y;
				RenderM.yPos += yDiff;
			}
		// Listen for mouse events
		}).mousedown(event => {
			InputM.holdingMouse = true;
			InputM.mouseMoved = 0; // how many mouse movements have been done

		}).mousemove(event => {
			if(InputM.holdingMouse && InputM.mouseX !== undefined && InputM.mouseY !== undefined) {
				const oldReal = screenToReal({'x': InputM.mouseX, 'y': InputM.mouseY});
				const curReal = screenToReal({'x': event.pageX, 'y': event.pageY});
				const xDiff = oldReal.x - curReal.x;
				const yDiff = oldReal.y - curReal.y;
				RenderM.moveCameraPos(xDiff, yDiff);
			}
			InputM.mouseMoved++;
			InputM.mouseX = event.pageX;
			InputM.mouseY = event.pageY;
		}).mouseup(event => {
			InputM.holdingMouse = false;

			// If the mouse hasn't moved much, assume a normal click was done
			if(InputM.mouseMoved < 5) {
				const canvasCenterX = RenderM._canvas.width / 2;
				const canvasCenterY = RenderM._canvas.height / 2;
				const thisSystem = GameM.getRenderEntities(GameM.viewingSystem);

				let mouseRange = [];

				for(let entity of thisSystem) {
					let drawX = canvasCenterX + (entity.xPos - RenderM.xPos) * RenderM.zoom;
					let drawY = canvasCenterY + (entity.yPos - RenderM.yPos) * RenderM.zoom;
					let distance = Math.sqrt((drawX - event.pageX)**2 + (drawY - event.pageY)**2);
					let drawRadius = Math.max(entity.minRadius, entity.radius * RenderM.zoom) + 2;
					if(distance <= drawRadius) {
						mouseRange.push(entity);
					}
				}

				let clickedOn = mouseRange[0];

				// Found an entity to click on
				if(clickedOn && clickedOn['onClick']) {
					clickedOn.onClick(event);
				}
			}
			InputM.mouseMoved = 0;

		});
		*/
	}

	/**
		Move every 5ms if keys are being pressed
	*/
	movementLoop() {
		if(InputM.movementInterval || (
			!InputM.keysHolding['north'] && !InputM.keysHolding['south'] &&
			!InputM.keysHolding['east'] && !InputM.keysHolding['west'])
		) {
			return;
		}
		InputM.movementInterval = setInterval(() => {
			let moved = false;
			let movement = {'x': 0, 'y': 0};

			if(InputM.keysHolding['north']) {
				movement.y = -1;
				moved = true;
			}
			if(InputM.keysHolding['south']) {
				movement.y = 1;
				moved = true;
			}
			if(InputM.keysHolding['east']) {
				movement.x = 1;
				moved = true;
			}
			if(InputM.keysHolding['west']) {
				movement.x = -1;
				moved = true;
			}
			RenderM.moveCamera(movement);

			if(!moved) {
				clearInterval(InputM.movementInterval);
				InputM.movementInterval = undefined;
			}
		}, 10);
	}

	/**
		Increase Zoom factor
	*/
	zoomIn(factor) {
		factor = factor || 1.5;
		RenderM.setZoom(Math.min(RenderM.zoom * factor, 1), true);
	}

	/**
		Decrease zoom factor
	*/
	zoomOut(factor) {
		factor = factor || 1.5;
		RenderM.setZoom(RenderM.zoom / factor, true);
	}

	pauseToggle() {
		GameM.paused = !GameM.paused;
	}

	/* Debug key */
	test() {
		console.time();
		GameM.clockForward(1);
		console.timeEnd();
		/*
		let time = 2.592e+6; // 1 month

		let processing = setInterval(() => {
			for(let i = 1; i <= 5000; i++) {
				if(time <= 0) {
					console.log("supposed to stop!");
					clearInterval(processing);
					return;
				}
				time -= 5;
				GameM.clockForward(5);
			}
		}, 100);
		*/
	}
}
InputM = new InputManager();
