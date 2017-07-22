var RenderM; // static RenderManager container

/*
	Turn screen coordinate into real coordinates
*/
function screenToReal(coords) {
	if(!coords) return;

	const canvasCenterX = Math.round(RenderM._canvas.width / 2);
	const canvasCenterY = Math.round(RenderM._canvas.height / 2);
	const realCoords = {};

	realCoords.x = ((RenderM.xPos * RenderM.zoom) + (coords.x - canvasCenterX)) / RenderM.zoom;
	realCoords.y = ((RenderM.yPos * RenderM.zoom) + (coords.y - canvasCenterY)) / RenderM.zoom;

	return realCoords;
}


// The default alpha value for the orbit ellipse for small celestials
const ORBIT_INTENSITY_MOD = [];
	ORBIT_INTENSITY_MOD[ENTITY.ASTEROID] = 0.05;
	ORBIT_INTENSITY_MOD[ENTITY.COMET] = 0.1;
	ORBIT_INTENSITY_MOD[ENTITY.MOON | ENTITY.DWARF] = 0.4;
	ORBIT_INTENSITY_MOD[ENTITY.PLANET | ENTITY.DWARF] = 0.5;
	ORBIT_INTENSITY_MOD[ENTITY.MOON] = 0.7;

/**
	The rendering manager, draws to the canvas when needed
*/
class RenderManager {
	constructor() {
		RenderM = this;

		/* x, y coordinates of the player camera */
		RenderM.xPos = 0;
		RenderM.yPos = 0;

		/* camera speed */
		RenderM.cameraSpeed = 4; // default movement speed

		/* Zoom factor of the player camera */
		RenderM.zoom = 0.000002;

		/* The selected render method */
		RenderM.renderMethod = 'Canvas2D';

	}

	/**
		Called when the DOM is fully loaded
	*/
	initiate() {

		RenderM._canvas = $('#canvas')[0];
		RenderM._context = RenderM._canvas.getContext('2d');

		// The render loop (60 fps)
		if(RenderM.renderMethod) {
			setInterval(RenderM.renderFrameCanvas2D, 16);
		} else {
			setInterval(RenderM.renderFrameWebGL, 16);
		}
	}

	/**
		Move the camera
	 */
	moveCamera(dir) {
		if(!dir) {
			return;
		}
		// Camera speed increases as zoom decreases
		let speed = RenderM.cameraSpeed / RenderM.zoom;
		RenderM.xPos += dir.x * speed;
		RenderM.yPos += dir.y * speed;
		GameM.target = undefined; // camera movement deselects target
	}

	/**
		Move the camera by exact x/y offsets
	*/
	moveCameraPos(xOff, yOff) {
		RenderM.xPos += xOff;
		RenderM.yPos += yOff;
		GameM.target = undefined; // camera movement deselects target
	}

	/**
		Iterate through every RenderEntity in the currently-viewed Star System and render them.
			- Powered by Canvas 2D
	*/
	renderFrameCanvas2D() {
		// Clear the canvas
		const context = RenderM._context;
		context.clearRect(0, 0, RenderM._canvas.width, RenderM._canvas.height);

		// Find all the entities to render this frame
		const renderEntities = GameM.getRenderEntities(GameM.viewingSystem);
		if(!renderEntities || !renderEntities.length) return;

		// Constant canvas dimensions
		const canvasCenterX = RenderM._canvas.width / 2;
		const canvasCenterY = RenderM._canvas.height / 2;

		// Center on the target every frame - if we have one
		if(GameM.target) {
			RenderM.xPos = GameM.target.xPos;
			RenderM.yPos = GameM.target.yPos;
		}

		for(let i = 0, len = renderEntities.length; i < len; i++) {
			let entity = renderEntities[i];

			// Render the entity
			let drawX = canvasCenterX + (entity.xPos - RenderM.xPos) * RenderM.zoom;
			let drawY = canvasCenterY + (entity.yPos - RenderM.yPos) * RenderM.zoom;
			let drawRadius = Math.max(entity.minRadius, entity.radius * RenderM.zoom);

			// Draw the orbit before the entity itself
			if(entity.orbit) {
				context.globalCompositeOperation = 'destination-over';
				let orbit = entity.orbit;
				let orbitCenter = entity.getOrbitalCenter();
				let orbitX = canvasCenterX + (orbitCenter.xPos - RenderM.xPos) * RenderM.zoom;
				let orbitY = canvasCenterY + (orbitCenter.yPos - RenderM.yPos) * RenderM.zoom;

				// prevent javascript from trying to draw ulta-large ellipses
				let orbitAlpha = 1 - (orbit.semimajorAxis * RenderM.zoom) / Util.MAX_ELLIPSE_SEMIMAJOR;
				if(orbitAlpha >= 0.99) {
					orbitAlpha = 1;
				}
				if(ORBIT_INTENSITY_MOD[entity.eClass]) {
					orbitAlpha *= ORBIT_INTENSITY_MOD[entity.eClass];
				}
				
				if(orbitAlpha > 0) {
					context.beginPath();
					context.strokeStyle = 'rgba(113,117,130,' + orbitAlpha + ')';
					context.ellipse(orbitX, orbitY, orbit.semimajorAxis * RenderM.zoom, orbit.semiminorAxis * RenderM.zoom, -orbit.omega, 0, 2 * Math.PI);
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
			if((drawRadius > 2 || RenderM.zoom >= 0.0001 || entity.orbit.focus.eClass & ENTITY.STAR) && entity.name) {
				context.textAlign = 'center';
				context.font = '12px monospace';
				context.fillText(entity.name, drawX, (drawY + drawRadius * 1.1) + 10);
			}
		}
	}
}
new RenderManager();
