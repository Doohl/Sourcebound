/**
 * Enumerate entity classes
 */
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


	// Empire Units
	VESSEL:			0x200,		// a vessel is any empire-made object, manned or unmanned
		SHIP:		0x400,		// a ship is a manned vessel equipped with engines
		DRONE:		0x800,		// a drone is an unmanned vessel equipped with engines
		STATION:	0x1000,		// a station is a large habitable vessel with reduced maneuverability (if any) - can be orbital or ground-based

		MILITARY:	0x2000,		// a military vessel belongs to an empire's military
		
	
	COLONY:			0x4000		// a colony is a ground-based civilian population
};


/**
 * An Entity is any object representing something in the game world. This may include: planets, stars, starships, 
 * cultures, empires, etc.
 */
class Entity {

	/**
	 * Entity constructor method
	 * @param {string} [name]
	 * 		Defines the name of this entity 
	 * @param {Coord} [coords] 
	 * 		Defines the default coordinates of this entity
	 */
	constructor(name, coords) {

		/** The entity's non-unique name */
		this.name = name || "";

		/** The entity's class */
		this.eClass = ENTITY.NULL;

		if(coords) {
			// Set this entity's location
			this.setPos(coords.xPos, coords.yPos, coords.system);
		}

		// Register this entity to LogicM
		LogicM.addEntity(this);
	}

	/**
	 * 
	 * @param {number} xPos
	 * 		The new x coordinate 
	 * @param {number} yPos 
	 * 		The new y coordinate
	 * @param {string} system 
	 * 		The name of the star system 
	 */
	setPos(xPos, yPos, system) {
		this.xPos = xPos || 0;
		this.yPos = yPos || 0;
		this.system = system;
	}
}

/**
 * A RenderEntity is an entity that structures render data. It can be drawn onto the screen.
 * @extends Entity
 */
class RenderEntity extends Entity {

	/**
	 * RenderEntity constructor method
	 * @param {string} name
	 * 		Defines the name of this entity 
	 * @param {Coord} coords
	 * 		Defines the default coordinates of this entity
	 * @param {Object} displayProps 
	 * 		Defines the default display properties
	 * @param {number} displayProps.radius
	 * 		The radius of the entity's circle, in km.
	 * @param {number} [displayProps.minRadius]
	 * 		The minimum possible radius of the entity's circle, in pixels
	 * @param {string} [displayProps.color]
	 * 		The entity's render color
	 */
	constructor(name, coords, displayProps) {
		super(name, coords);

		/** Set to true if this entity can be rendered */
		this.canRender = true;

		/** Entity's draw radius */
		this.radius = displayProps.radius || 0;

		/** Entity's minimum radius */
		this.minRadius = displayProps.minRadius || 0;

		/** Entity's draw color */
		this.color = displayProps.color || '#ffffff';

		// Register this visible entity to the Logic Module
		if(LogicM.getViewingSystem() == pCoords.system) {
			RenderM.addRenderEntity(this);
		}
	}
}