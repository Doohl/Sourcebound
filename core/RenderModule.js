/**
 * The Render Module:
 * 
 * Responsible for drawing to the canvas and handling all the
 * related logic.
 * 
 * @module Sourcebound/RenderModule
 */

var RenderM = (function() {

	/** x coordinate of the player camera */
	var _xPos = 0;

	/** y coordinate of the player camera */
	var _yPos = 0;

	/** Default camera movement speed (for WASD/arrow movement) */
	var _cameraSpeed = 4;

	/** The zoom factor of the player camera */
	var _zoom = 0.000002;

	/** The current render method */
	var _renderMethod = 'Canvas';

	/** The attached canvas */
	var _canvas;

	/** The 2D context to draw to */
	var _context;

	/** 
	 * An array of RenderEntities that need to be rendered 
	 * @type {Array.<RenderEntity>}
	*/
	var _renderEntities = [];

	/**
	 * An array of Orbits that need to be rendered
	 * @type {Array.<KeplerOrbit>}
	 */
	var _renderOrbits = [];

	// Begin defining exports
	return {

		/**
		 * Get the coordinates of the player camera
		 * @return {Point}
		 * 		The current realspace coordinates of the player camera
		 */
		getCamera: function() {
			return {
				xPos: _xPos,
				yPos: _yPos
			};
		},

		/**
		 * Get the current zoom factor
		 * @return {number}
		 * 		The current zoom factor from [infinity, 1]
		 */
		getZoom: function() {
			return _zoom;
		},

		/**
		 * Move the camera by specific x/y offsets 
		 * @param {number} xOff
		 * 		The x offset
		 * @param {number} yOff
		 * 		The y offset
		 */
		moveCamera: function(xOff, yOff) {
			_xPos += xOff;
			_yPos += yOff;
			
			//GameM.setTarget(undefined);
		},

		/**
		 * Set a new zoom factor (with an optional pivot point)
		 * @param {number} newZoom
		 * 		The new zoom factor
		 * @param {Point} [pivotPoint]
		 * 		If defined, pivot around this x/y coordinate
		 */
		setZoom: function(newZoom, pivotPoint) {
			if(pivotPoint) {
				const canvasCenterX = _canvas.width / 2,
					canvasCenterY = _canvas.height / 2;

				let oldRealX = ((_xPos * _zoom) + (pivotPoint.xPos - canvasCenterX)) / _zoom,
					oldRealY = ((_yPos * _zoom) + (pivotPoint.yPos - canvasCenterY)) / _zoom,
					newRealX = ((_xPos * newZoom) + (pivotPoint.xPos - canvasCenterX)) / newZoom,
					newRealY = ((_yPos * newZoom) + (pivotPoint.yPos - canvasCenterY)) / newZoom;

				_xPos += oldRealX - newRealX;
				_yPos += oldRealY - newRealY;
			}

			_zoom = newZoom;
		},

		/**
		 * Get the active canvas
		 * @return {HTMLCanvasElement}
		 * 		The active canvas element
		 */
		getCanvas: function() {
			return _canvas;
		},

		/**
		 * Get the active canvas' rendering context
		 * @return {CanvasRenderingContext2D}
		 * 		The interface used for drawing primitives
		 */
		getContext: function() {
			return _context;
		},

		/**
		 * Set the camera's position to a specific location
		 * @param {number} xPos
		 * 		The x coordinate
		 * @param {number} yPos
		 * 		The y coordinate
		 */
		setCamera: function(xPos, yPos) {
			_xPos = xPos;
			_yPos = yPos;
		},

		/**
		 * Get the array of RenderEntities that need to be rendered
		 * @return {Array.<RenderEntity>}
		 * 		The array of RenderEntities to render
		 */
		getRenderEntities: function() {
			return _renderEntities;
		},

		/**
		 * Add a RenderEntity to the list of RenderEntities
		 * @param {RenderEntity} renderEntity
		 * 		The RenderEntity to add
		 */
		addRenderEntity: function(renderEntity) {
			_renderEntities.push(renderEntity);
		},

		/**
		 * Get the array of KeplerOrbit that need to be rendered
		 * @return {Array.<KeplerOrbit>}
		 * 		The array of KeplerOrbit to render
		 */
		getRenderOrbits: function() {
			return _renderOrbits;
		},

		/**
		 * Add a KeplerOrbit to the list of rendered orbits
		 * @param {KeplerOrbit} orbit
		 */
		addRenderOrbit: function(orbit) {
			_renderOrbits.push(orbit);
		},

		/**
		 * Called when the DOM is ready
		 */
		onDOMReady: function() {
			_canvas = document.getElementById('canvas');
			_context = _canvas.getContext('2d');

			// Begin the render loop
			renderFrameCanvas();
		}
	};

}());

/** The default alpha value for the orbit ellipse for small celestials */
const ORBIT_INTENSITY_MOD = [];
	ORBIT_INTENSITY_MOD[ENTITY.ASTEROID] = 0.05;
	ORBIT_INTENSITY_MOD[ENTITY.COMET] = 0.1;
	ORBIT_INTENSITY_MOD[ENTITY.MOON | ENTITY.DWARF] = 0.4;
	ORBIT_INTENSITY_MOD[ENTITY.PLANET | ENTITY.DWARF] = 0.5;
	ORBIT_INTENSITY_MOD[ENTITY.MOON] = 0.7;

/**
 * Iterate through and render every entity in _renderEntities
 */
function renderFrameCanvas() {
	
	// Begin looping
	requestAnimationFrame(renderFrameCanvas);

	// Clear the canvas
	const canvas = RenderM.getCanvas();
	const context = RenderM.getContext();
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Find all the entities that need to be rendered this frame
	const renderEntities = RenderM.getRenderEntities();

	// Find all orbits that need to be rendered
	const renderOrbits = RenderM.getRenderOrbits();
	
	// Constant canvas dimensions
	const canvasCenterX = canvas.width / 2;
	const canvasCenterY = canvas.height / 2;

	// Center on the target
	const target = LogicM.getTarget();
	if(LogicM.getTarget()) {
		RenderM.setCamera(target.xPos, target.yPos);
	}

	// Camera coordinates
	const camera = RenderM.getCamera();
	
	// Camera zoom
	const zoom = RenderM.getZoom();

	// First, iterate through the orbits
	let orbit;
	for(let i = 0, len = renderOrbits.length; i < len; i++) {
		orbit = renderOrbits[i];

		const orbitCenter = orbit.getCenter();
		const drawCenterX = canvasCenterX + (orbitCenter.xPos - camera.xPos) * zoom;
		const drawCenterY = canvasCenterY + (orbitCenter.yPos - camera.yPos) * zoom;

		// prevent JS from trying to draw ultra-large ellipses
		let orbitAlpha = 1 - (orbit.semimajorAxis * zoom) / Util.MAX_ELLIPSE_SEMIMAJOR;
		if(orbitAlpha >= 0.99) {
			orbitAlpha = 1;
		}
		
		//if(ORBIT_INTENSITY_MOD[orbit.entity.eClass]) {
		//	orbitAlpha *= ORBIT_INTENSITY_MOD[orbit.entity.eClass];
		//}

		if(orbitAlpha > 0) {
			context.beginPath();
			context.strokeStyle = 'rgba(113,117,130,' + orbitAlpha + ')';
			console.log(orbit.lPeriapsis);
			context.ellipse(drawCenterX, drawCenterY, orbit.semimajorAxis * zoom, orbit.semiminorAxis * zoom, -orbit.lPeriapsis, 0, 2 * Math.PI);
			context.stroke();
		}
	}

	// Iterate through the renderEntities
	let entity;
	for(let i = 0, len = renderEntities.length; i < len; i++) {
		entity = renderEntities[i];

		const drawRadius = Math.max(entity.minRadius, entity.radius * zoom);
		if(!drawRadius) {
			continue;
		}

		const drawX = canvasCenterX + (entity.xPos - camera.xPos) * zoom;
		const drawY = canvasCenterY + (entity.yPos - camera.yPos) * zoom;

		context.beginPath();
		context.arc(drawX, drawY, drawRadius, 0, 2 * Math.PI);
		context.fillStyle = entity.color;
		context.fill();

		// Draw the entity's name
		if((drawRadius > 2 || RenderM.zoom >= 0.0001 || entity.orbit.focus.eClass & ENTITY.STAR) && entity.name) {
			context.textAlign = 'center';
			context.font = '12px monospace';
			context.fillText(entity.name, drawX, (drawY + drawRadius * 1.1) + 10);
		}

		context.closePath();

	}

}
