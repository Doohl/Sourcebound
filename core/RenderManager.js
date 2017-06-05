var renderM; // static RenderManager container

const MAX_ELLIPSE_SEMIMAJOR = 2206733; // ellipses should NEVER exceed this amount

/*
	Turn screen coordinate into real coordinates
*/
function screenToReal(coords) {
	if(!coords) return;

	const canvasCenterX = Math.round(renderM._canvas.width / 2);
	const canvasCenterY = Math.round(renderM._canvas.height / 2);
	const realCoords = {};

	realCoords.x = ((renderM.xPos * renderM.zoom) + (coords.x - canvasCenterX)) / renderM.zoom;
	realCoords.y = ((renderM.yPos * renderM.zoom) + (coords.y - canvasCenterY)) / renderM.zoom;

	return realCoords;
}


/**
	The rendering manager, draws to the canvas when needed
*/
class RenderManager {
	constructor() {
		renderM = this;

		/* x, y coordinates of the player camera */
		renderM.xPos = 0;
		renderM.yPos = 0;

		/* camera speed */
		renderM.cameraSpeed = 4; // default movement speed

		/* Zoom factor of the player camera */
		renderM.zoom = 0.000002;
	}

	/**
		Called when the DOM is fully loaded
	*/
	initiate() {

		renderM._canvas = $('#canvas')[0];
		renderM._context = renderM._canvas.getContext('2d');

		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', renderM.resizeCanvas, false);

		renderM.resizeCanvas();

		// The render loop (45 fps)
		setInterval(renderM.renderFrame, 15);
	}

	/**
		Handle window resizing
	*/
	resizeCanvas() {
		renderM._canvas.width = window.innerWidth;
		renderM._canvas.height = window.innerHeight;
		renderM.renderFrame();
	}

	/**
		Move the camera
	 */
	moveCamera(dir) {
		if(!dir) {
			return;
		}
		// Camera speed increases as zoom decreases
		let speed = renderM.cameraSpeed / renderM.zoom;
		renderM.xPos += dir.x * speed;
		renderM.yPos += dir.y * speed;
		gameM.target = undefined; // camera movement deselects target
	}

	/**
		Move the camera by exact x/y offsets
	*/
	moveCameraPos(xOff, yOff) {
		renderM.xPos += xOff;
		renderM.yPos += yOff;
		gameM.target = undefined; // camera movement deselects target
	}

	/**
		Iterate through every RenderEntity in the currently-viewed Star System and render them.
	*/
	renderFrame() {
		// Clear the canvas
		const context = renderM._context;
		context.clearRect(0, 0, renderM._canvas.width, renderM._canvas.height);

		// Find all the entities to render this frame
		const renderEntities = gameM.getRenderEntities(gameM.viewingSystem);
		if(!renderEntities || !renderEntities.length) return;

		// Constant canvas dimensions
		const canvasCenterX = renderM._canvas.width / 2;
		const canvasCenterY = renderM._canvas.height / 2;

		// Center on the target every frame - if we have one
		if(gameM.target) {
			renderM.xPos = gameM.target.xPos;
			renderM.yPos = gameM.target.yPos;
		}

		for(let i = 0, len = renderEntities.length; i < len; i++) {
			let entity = renderEntities[i];

			// Render the entity
			let drawX = canvasCenterX + (entity.xPos - renderM.xPos) * renderM.zoom;
			let drawY = canvasCenterY + (entity.yPos - renderM.yPos) * renderM.zoom;
			let drawRadius = Math.max(entity.minRadius, entity.radius * renderM.zoom);

			// Draw the orbit before the entity itself
			if(entity.orbit) {
				context.globalCompositeOperation = 'destination-over';
				let orbit = entity.orbit;
				let orbitCenter = entity.getOrbitalCenter();
				let orbitX = canvasCenterX + (orbitCenter.xPos - renderM.xPos) * renderM.zoom;
				let orbitY = canvasCenterY + (orbitCenter.yPos - renderM.yPos) * renderM.zoom;

				// prevent javascript from trying to draw ulta-large ellipses
				let orbitAlpha = 1 - (orbit.semimajorAxis * renderM.zoom) / MAX_ELLIPSE_SEMIMAJOR;
				if(orbitAlpha >= 0.99) {
					orbitAlpha = 1;
				}
				if(orbitAlpha > 0) {
					context.beginPath();
					context.strokeStyle = 'rgba(113,117,130,' + orbitAlpha + ')';
					context.ellipse(orbitX, orbitY, orbit.semimajorAxis * renderM.zoom, orbit.semiminorAxis * renderM.zoom, -orbit.omega, 0, 2 * Math.PI);
					context.stroke();
				}
			}

			if(!drawRadius) {
				continue;
			}

			context.globalCompositeOperation = 'source-over';

			// Draw the entity circle
			context.beginPath();
			context.arc(drawX, drawY, drawRadius, 0, 2 * Math.PI);
			context.fillStyle = entity.fillColor;
			context.fill();
			if(entity.strokeWidth) {
				context.lineWidth = entity.strokeWidth;
				context.strokeStyle = entity.strokeColor;
				context.stroke();
			}

			// Draw the entity's name
			if((drawRadius > 2.2 || renderM.zoom >= 0.0001) && entity.name) {
				context.textAlign = 'center';
				context.font = '12px monospace';
				context.fillText(entity.name, drawX, (drawY + drawRadius * 1.1) + 10);
			}
		}
	}
}
new RenderManager();
