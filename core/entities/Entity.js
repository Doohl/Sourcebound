/**
	Entities are objects that contain logic to be processed every time increment, as well as a unique ID.
*/
class Entity {
	constructor() {

		/* The entity's non-unique name */
		this.name = "";

		/* The entiy's class */
		this.eClass = 'Blank';

		// Register this entity to gameM
		gameM.addEntity(this);
	}
}

/**
	Render Entities are Entities that can be rendered on screen. They are represented as circles.
*/

class RenderEntity extends Entity {
	constructor(pCoords, pRadius, pFillColor, pStrokeColor, pStrokeWidth) {
		super();

		this.canRender = true;

		/* Circle radius */
		this.radius = pRadius; // radius of the entity in kilometers

		/* The entity's minimum radius */
		this.minRadius = 0;

		/* Circle fill color */
		this.fillColor = pFillColor || 'rgb(255, 255, 255)';

		/* Circle stroke color */
		this.strokeColor = pStrokeColor || 'rgba(255, 255, 255, 0.75)';

		/* Circle stroke width (0 if no width) */
		this.strokeWidth = pStrokeWidth || 0;

		/* x, y coordinates (points to center of circle) */
		this.xPos = pCoords[0] || 0;
		this.yPos = pCoords[1] || 0; // (0,0) points to center of Star System - the star itself, if unary star system

		/* Star System this entity is located in */
		this.starSystem = pCoords[2];

		// Register this visible entity to gameM
		gameM.visibleEntity(this, pCoords[2]);
	}
}
