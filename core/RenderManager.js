var RenderM; // static RenderManager container

/*
	Turn screen coordinate into real coordinates
*/
function screenToReal(coords) {

	const canvasCenterX = window.innerWidth / 2;
	const canvasCenterY = window.innerHeight / 2;

	return {
		x: ((RenderM.xPos * RenderM.zoom) + (coords.x - canvasCenterX)) / RenderM.zoom,
		y: ((RenderM.yPos * RenderM.zoom) + (coords.y - canvasCenterY)) / RenderM.zoom
	};
}

/**
 * Transform real coordinates to screen coordinates
 */
function realToScreen(coords) {

	const canvasCenterX = window.innerWidth / 2;
	const canvasCenterY = window.innerHeight / 2;

	return {
		x: canvasCenterX + (coords.x - RenderM.xPos) * RenderM.zoom,
		y: canvasCenterY + (coords.y - RenderM.yPos) * RenderM.zoom
	};
}


function realXToScreen(x) {
	const canvasCenterX = window.innerWidth / 2;
	return canvasCenterX + (x - RenderM.xPos) * RenderM.zoom
}
function realYToScreen(y) {
	const canvasCenterY = window.innerHeight / 2;
	return canvasCenterY + (y - RenderM.yPos) * RenderM.zoom
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
		RenderM.zoom = 1;

		/* The selected render method */
		RenderM.renderMethod = 'WebGL';

		/* The pixiJS renderer object */
		RenderM.renderer = undefined;

		/* The main render stage */
		RenderM._stage = undefined;

		/* The container that organizes all RenderEntities */
		RenderM._entityContainer = undefined;

		/* The container that organizes all entity orbits */
		RenderM._orbitContainer = undefined;
	}

	/**
		Called when the DOM is fully loaded
	*/
	initiate() {

		if(!PIXI.utils.isWebGLSupported()) {
			RenderM.renderMethod = 'canvas';
		}
		PIXI.utils.sayHello(RenderM.renderMethod);
		
		RenderM.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
			antialias: true, 
			backgroundColor: 0x0F1A40,
			autoResize: true
		});
		document.body.appendChild(RenderM.renderer.view);

		RenderM._stage = new PIXI.Container();

		RenderM._entityContainer = new PIXI.Container();
		RenderM._orbitContainer = new PIXI.Container();

		var circle = new PIXI.Graphics();
		circle.beginFill(0x9966FF);
		circle.drawCircle(0, 0, 32);
		circle.endFill();
		circle.x = 100;
		circle.y = 0;
		circle.scale.set(1);
		//RenderM._entityContainer.addChild(circle);

		var circle2 = new PIXI.Graphics();
		circle2.beginFill(0x9966FF);
		circle2.drawCircle(0, 0, 50000);
		circle2.endFill();
		circle2.x = 100000;
		circle2.y = 0;
		//RenderM._entityContainer.addChild(circle2);

		//RenderM._stage.position.set(window.innerWidth / 2, window.innerHeight / 2);

		RenderM._stage.addChild(RenderM._orbitContainer);
		RenderM._stage.addChild(RenderM._entityContainer);

		/* Initiate the render loop */
		RenderM.renderFrame();

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
		RenderM._stage.position.x += dir.x * speed;
		RenderM._stage.position.y += dir.y * speed;
		GameM.target = undefined; // camera movement deselects target
	}

	/**
		Move the camera by exact x/y offsets
	*/
	moveCameraPos(xOff, yOff) {
		RenderM.xPos += xOff;
		RenderM.yPos += yOff;

		//RenderM._entityContainer.position.set(-RenderM.xPos, -RenderM.yPos);
		//RenderM._orbitContainer.position.set(-RenderM.xPos, -RenderM.yPos);

		GameM.target = undefined; // camera movement deselects target

		RenderM.updateGraphics();
	}

	/**
	 * Sets a new zoom level
	 * 
	 * @param {number} newZoom The new zoom factor
	 * @param {boolean} [pivot=false] If true, pivot around the current mouse position
	 */
	setZoom(newZoom, pivot) {
		const oldReal = screenToReal({x: InputM.mouseX, y: InputM.mouseY});

		RenderM.zoom = newZoom;
		//RenderM._stage.scale.set(newZoom);
		/*
		for(let child of RenderM._entityContainer.children) {
			console.log(child);
			child.scale.set(newZoom);
		}
		*/

		// If the player has no target, center the zoom around their cursor
		if(!GameM.target && pivot) {
			const curReal = screenToReal({x: InputM.mouseX, y: InputM.mouseY});
			const xDiff = oldReal.x - curReal.x;
			const yDiff = oldReal.y - curReal.y;

			this.moveCameraPos(xDiff, yDiff);
		} else {
			RenderM.updateGraphics();
		}
	}

	/**
	 * Returns the main pixijs stage
	 */
	getStage() {
		return RenderM._stage;
	}

	/**
	 * Gives an entity graphics
	 */
	setGraphics(pEntity) {
		if(pEntity.graphics) {
			this._entityContainer.removeChild(pEntity.graphics);
		}
		if(pEntity.orbit && pEntity.orbit.graphics) {
			this._orbitContainer.removeChild(pEntity.orbit.graphics);
		}
		pEntity.graphics = new PIXI.Graphics();
		pEntity.graphics.beginFill(pEntity.fillColor);
		pEntity.graphics.lineStyle(5, 0xFFFFFF, 1);
		pEntity.graphics.drawCircle(0, 0, pEntity.radius);
		pEntity.graphics.endFill();
		pEntity.graphics.position.set(realXToScreen(pEntity.xPos), realYToScreen(pEntity.yPos));
		pEntity.graphics.minScale = pEntity.minRadius / pEntity.radius;
		pEntity.graphics.scale.set(Math.max(pEntity.graphics.minScale, RenderM.zoom));

		this._entityContainer.addChild(pEntity.graphics);

		if(pEntity.orbit && pEntity.name == "Mercury") {
			const orbitCenter = pEntity.getOrbitalCenter();
			console.log("draw");
			pEntity.orbit.graphics = new PIXI.Graphics();
			pEntity.orbit.graphics.lineStyle(5, 0x717582);
			pEntity.orbit.graphics.drawEllipse(0, 0, pEntity.orbit.semimajorAxis, pEntity.orbit.semiminorAxis);
			pEntity.orbit.graphics.position.set(realXToScreen(orbitCenter.xPos), realYToScreen(orbitCenter.yPos));
			pEntity.orbit.graphics.scale.set(RenderM.zoom);

			this._orbitContainer.addChild(pEntity.orbit.graphics);
		}

	}

	/**
	 * Updates the graphics of every RenderEntity
	 */
	updateGraphics() {
		const renderEntities = GameM.getRenderEntities(GameM.viewingSystem);
		const zoom = RenderM.zoom;

		let entity, graphics, orbit;
		for(let i = 0, len = renderEntities.length; i < len; i++) {
			entity = renderEntities[i];
			graphics = entity.graphics;
			orbit = entity.orbit;

			// Update this entity's graphics
			if(graphics) {
				graphics.position.set(realXToScreen(entity.xPos), realYToScreen(entity.yPos));
				graphics.scale.set(Math.max(graphics.minScale, zoom));
			}

			// Update this entity's orbit
			if(orbit && orbit.graphics) {
				const orbitCenter = entity.getOrbitalCenter();
				orbit.graphics.position.set(realXToScreen(orbitCenter.xPos), realYToScreen(orbitCenter.yPos));
				orbit.graphics.scale.set(zoom);
			}
		}
		
	}
	

	/**
		Render a single frame: optionally, re-draw every RenderEntity's graphics
	*/
	renderFrame() {
		
		// Begin looping
		requestAnimationFrame(RenderM.renderFrame);

		RenderM.renderer.render(RenderM._stage);
	
		/*



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
		*/
	}
}
new RenderManager();
