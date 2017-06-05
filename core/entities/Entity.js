/**
	Entities are objects that contain logic to be processed every time increment, as well as a unique ID.
*/
class Entity {
	constructor(pName) {

		/* The entity's non-unique name */
		this.name = pName || "";

		/* The entiy's class */
		this.eClass = 'Blank';

		// Register this entity to GameM
		GameM.addEntity(this);
	}
}

/**
	Render Entities are Entities that can be rendered on screen. They are represented as circles.
*/

class RenderEntity extends Entity {
	constructor(pName, pCoords, pMass, pRadius, pFillColor, pStrokeColor, pStrokeWidth) {
		super(pName);

		this.canRender = true;

		/* Entity's mass in kilograms */
		this.mass = pMass;

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
		this.xPos = pCoords.xPos || 0; // (0,0) points to center of Star System - the star itself, if unary star system
		this.yPos = pCoords.yPos || 0;

		/* The Star System this entity is in */
		this.system = pCoords.system;

		// Register this visible entity to GameM
		GameM.visibleEntity(this, pCoords.system);
	}
}
