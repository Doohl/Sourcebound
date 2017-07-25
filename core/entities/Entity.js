/* Enumerate entity classes */
const ENTITY = {

	NULL:			0x00,

	// Base celestial classes
	ASTEROID:		0x01,		// floating rock in space, orbits star
	COMET:			0x02,		// an asteroid with a highly-eccentric orbit
	PLANET:			0x04,		// a large celestial that orbits a star
	MOON:			0x08,		// something that orbits a celestial that is not a star
	STAR:			0x10,		// a luminous sphere of plasma, typically the center of a solar system
	BLACKHOLE:		0x20,		// a object dense enough to maintain an event horizon

	// Celestial modifiers
	GAS:			0x40,		// is a gas giant / gas planet
	DWARF:			0x80,		// is a "dwarf" in its category
	NEUTRON:		0x100,		// is a neutron star

};

/**
	Entities are objects that contain logic to be processed every time increment, as well as a unique ID.
*/
class Entity {
	constructor(pName) {

		/* The entity's non-unique name */
		this.name = pName || "";

		/* The entity's class */
		this.eClass = ENTITY.NULL;

		// Register this entity to GameM
		GameM.addEntity(this);
	}
}

/**
	Render Entities are Entities that can be rendered on screen. They are represented as circles.
*/

class RenderEntity extends Entity {
	constructor(pName, pCoords, pMass, pRadius, pFillColor, pMinRadius) {
		super(pName);

		this.canRender = true;

		/* Entity's mass in kilograms */
		this.mass = pMass;

		/* Circle radius */
		this.radius = pRadius; // radius of the entity in kilometers

		/* The entity's minimum radius */
		this.minRadius = pMinRadius || 0;

		/* Circle fill color */
		this.fillColor = pFillColor || 0xFFFFFF;

		/* x, y coordinates (points to center of circle) */
		this.xPos = pCoords.xPos || 0; // (0,0) points to center of Star System - the star itself, if unary star system
		this.yPos = pCoords.yPos || 0;

		/* The Star System this entity is in */
		this.system = pCoords.system;

		// Register this visible entity to GameM
		GameM.visibleEntity(this, pCoords.system);
	}
}
