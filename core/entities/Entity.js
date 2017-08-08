
/**
 * A 32-bit unsigned bitfield that describes an entity's classification(s)
 * @typedef {number} EntityClass
 */

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
	GAS:			0x40,		// is a gas giant / gas world
	ICE:			0x80,		// is an ice giant / ice world
	DESERT:			0x100,		// is a desert world
	DWARF:			0x200,		// is a "dwarf" in its category
	GIANT:			0x400,		// is a "giant" in its category
	NEUTRON:		0x800,		// is a composed of "neutronium" (ie neutron stars)


	// Empire Units
	VESSEL:			0x1000,		// a vessel is any empire-made object, manned or unmanned
		SHIP:		0x2000,		// a ship is a manned vessel equipped with engines
		DRONE:		0x4000,		// a drone is an unmanned vessel equipped with engines
		STATION:	0x8000,		// a station is a large habitable vessel with reduced maneuverability (if any) - can be orbital or ground-based

		MILITARY:	0x10000,		// a military vessel belongs to an empire's military
		
	
	COLONY:			0x20000		// a colony is a ground-based civilian population
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
	 * @param {EntityClass} [eClass]
	 * 		Defines this entity's eClass
	 */
	constructor(name, coords, eClass) {

		/** The entity's non-unique name */
		this.name = name || "";

		/** The entity's class */
		this.eClass = eClass || ENTITY.NULL;

		if(coords) {
			// Set this entity's location
			this.setPos(coords.xPos, coords.yPos, coords.system);
		}

		// Register this entity to LogicM
		LogicM.addEntity(this);
	}

	/**
	 * 
	 * @param {number} [xPos=0]
	 * 		The new x coordinate 
	 * @param {number} [yPos=0] 
	 * 		The new y coordinate
	 * @param {string} [system] 
	 * 		The name of the star system 
	 */
	setPos(xPos=0, yPos=0, system) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.system = system || this.system;
	}
}


/**
 * A table describing an entity's display properties
 * 
 * @typedef {Object} DisplayProperties
 * @property {number} radius - The entity's real radius, in km
 * @property {number} [minRadius=0] - The entity's minimum draw radius, in pixels
 * @property {string} [color=#ffffff] - The entity's draw color
 */

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
	 * @param {DisplayProperties} displayProps 
	 * 		Defines the default display properties
	 * @param {EntityClass} [eClass]
	 * 		Defines this entity's eClass
	 */
	constructor(name, coords, displayProps, eClass) {
		super(name, coords, eClass);

		/** Set to true if this entity can be rendered */
		this.canRender = true;

		/** Entity's draw radius */
		this.radius = displayProps.radius || 0;

		/** Entity's minimum radius */
		this.minRadius = displayProps.minRadius || 0;

		/** Entity's draw color */
		this.color = displayProps.color || 'white';

		// Register this visible entity to the Logic Module
		if(LogicM.getViewingSystem() == coords.system) {
			RenderM.addRenderEntity(this);
		}
	}
}