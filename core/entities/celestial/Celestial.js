
/**
 * A table describing a celestial body's physical properties
 * 
 * @typedef {Object} CelestialProperties
 * @property {string} system - The name of the system this celestial belongs to
 * @property {string} name - The celestial's non-unique, non-constant name
 * @property {number} mass - The celestial's mass, in kg
 * @property {number} radius - The celestial's (average) radius, in km
 * @property {number} tilt - The celestial's axial tilt, in radians
 * @property {number} rotationalPeriod - How long it takes for this celestial to completely rotate, in hours
 * @property {Array} [hydrosphere] - The celestial's combined liquids
 * @property {Object} [atmosphere] - The celestial's combined gasses
 * @property {OrbitalElements} [orbit] - The celestial's orbit container
 * @property {string} [designation] - The celestial's unique, constant designation. If not defined, will attempt to generate one.
 */

/** 
 * Attempt to determine an entity's class based off its Celestial Properties
 * @param {CelestialProperties} props
 * 		The celestial properties to analyze
 * @return {EntityClass}
 * 		The Entity Class to return
 */
function getClass(props) {
	return ENTITY.PLANET;
}

/**
 * A Celestial is any natural body in space. This ranges from planets to moons, stars, asteroids, comets, etc.
 * @extends RenderEntity
 */
class Celestial extends RenderEntity {

	/**
	 * The Celestial constructor method
	 * @param {CelestialProperties} props
	 * 		Defines the default celestial properties 
	 * @param {string} color 
	 * 		Defines the celestial's color on the map
	 * @param {EntityClass} [eClass]
	 * 		Defines this entity's eClass
	 */
	constructor(props, color, eClass) {
		super(props.name, {xPos: 0, yPos: 0, system: props.system}, {color: color}, eClass);

		/** A list of satellites directly orbitting this celestial, both natural and unnatural */
		this.satellites = [];

		/** Mass of the celestial, in kg */
		this.mass = props.mass;

		/** Standard gravitational parameter */
		this.standardGrav = Util.G_CONSTANT * this.mass;

		/** Rotational period (in hours) */
		this.rotationPeriod = props.rotationPeriod;

		/** The hydrosphere defines the combined amount of liquid in this celestial */
		this.hydrosphere = props.hydrosphere;

		/** The atmosphere defines the combined amount of gas in this celestial */
		this.atmosphere = props.atmosphere;

		/* Define the orbital data */
		if(props.orbit) {
			this.setOrbit(props.orbit);
		}

		/** If there is no designation set, attempt to set one */
		if(!props.designation && this.orbit) {
			
			// Is the parent the root of the system?
			if(!this.orbit.focus.designation) {
				this.designation = this.orbit.focus.name + ""
			}

		} else {
			this.designation = props.designation;
		}
	}

	/**
	 * Set this celestial's orbit with the supplied orbital elements
	 * @param {OrbitalElements} orbitData 
	 * 		The orbital elements to use in the construction of a KeplerOrbit object
	 */
	setOrbit(orbitData) {
		this.orbit = new KeplerOrbit(orbitData.focus, this, orbitData);
		if(LogicM.getViewingSystem() == this.system) {
			RenderM.addRenderOrbit(this.orbit);
		}
	}


	/**
		Focus the camera on the celestial when clicked on
	*/
	onClick(event) {
		GameM.target = this;
		let t0 = new Date().getTime();

		//let targetVel = Math.sqrt(this.standardGrav / (this.radius * 1000) + 150000)/1000;
		const increment = 30;
		let increments = 0;
		const safeError = 30;
		const gForce = 1 * 0.00981;
		var startTime = GameM.universeClock;
		let time = GameM.universeClock;
		let computedError;
		let angle = undefined;
		let futurePos = undefined;
		while(angle === undefined) {
			increments++;
			let pos = this.computeCoordinates(time);
			let timeToPos = GameM.travelTime(RenderM, pos, gForce);
			let deltaT = time - startTime;
			computedError = Math.abs(timeToPos - deltaT)
			if(computedError <= safeError) {
				angle = Util.getAngle(RenderM, pos);
				futurePos = pos;
			}
			time += increment;
		}
		console.log(angle);
		console.log(computedError);
		console.log(increments);

		console.log((new Date().getTime()) - t0);

		let testShip = new DwarfPlanet({
			'name': 'SHIP',
			'system': 'Sol'
		});

		testShip.movingToward = this;
		testShip.velocity = {
			'speed': 0,
			'angle': angle
		};
		testShip.
		testShip.burn = gForce;

		let T = testShip;
		testShip.flightSolution = function(deltaT) {
			for(let i = 0; i < deltaT; i++) {
				T.velocity.speed += T.burn;
				T.xPos
			}
		}


	}
}

/**
 * Convert an integer to a roman numeral
 * @param {number} num
 * 		An integer number
 * @return {string|false}
 * 		Returns false if not a valid (nonzero) number, or a roman numeral string
 */
function romanize (num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

/**
 * Create a celestial from some input data
 * @param {CelestialProperties} data
 * 		An object containing celestial properties
 * @param {Celestial} [parent]
 * 		If defined, will automatically become an orbital of this parent celestial
 * @return {Celestial}
 * 		The celestial resulted from the data
 */
function loadCelestialData(data, parent) {
	let celestial;
	let entityClass;
	let entityColor;

	// This celestial is a star
	if(data.stellarClass) {
		entityClass = ENTITY.STAR;
		entityColor = computeColorBV(data.colorIndex)
	} else {
		entityClass = getClass(data);
		entityColor = '#98A7D6';
	}

	// A parent was defined
	if(parent && data.orbit) {
		data.orbit.focus = parent;
	}

	celestial = new Celestial(data, entityColor, entityClass);
	celestial.minRadius = 5;

	// Check to see if we need to iterate through any satellites
	if(celestial.satellites) {
		for(let index = 0, len = celestial.satellites.length; index < len; index++) {
			let satelliteData = celestial.satellites[index];
			celestial.satellites[index] = loadCelestialData(satelliteData);
		}
	}

	return celestial;
}