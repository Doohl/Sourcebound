
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
		super(props.name, {xPos: 0, yPos: 0, system: props.system}, {color: color, radius: props.radius}, eClass);

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
		entityColor = computeColorBV(data.colorIndex);
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
	if(data.satellites) {
		for(let index = 0, len = data.satellites.length; index < len; index++) {
			let satelliteData = data.satellites[index];
			satelliteData.system = celestial.system;
			data.satellites[index] = loadCelestialData(satelliteData, celestial);
		}
	}

	return celestial;
}



const COLOR_INDEXES = [
	[2.00, '#ff5200'],
	[1.95, '#ff7b00'],
	[1.90, '#ff9523'],
	[1.85, '#ffa94b'],
	[1.80, '#ffb765'],
	[1.75, '#ffc178'],
	[1.70, '#ffc885'],
	[1.65, '#ffcc8f'],
	[1.60, '#ffd096'],
	[1.55, '#ffd29c'],
	[1.50, '#ffd5a1'],
	[1.45, '#ffd6a5'],
	[1.40, '#ffd8a9'],
	[1.35, '#ffdaad'],
	[1.30, '#ffdbb0'],
	[1.25, '#ffddb4'],
	[1.20, '#ffdfb8'],
	[1.15, '#ffe0bb'],
	[1.10, '#ffe2bf'],
	[1.05, '#ffe3c3'],
	[1.00, '#ffe5c6'],
	[0.95, '#ffe6ca'],
	[0.90, '#ffe8ce'],
	[0.85, '#ffe9d2'],
	[0.80, '#ffebd6'],
	[0.75, '#ffeddb'],
	[0.70, '#ffefe0'],
	[0.65, '#fff1e5'],
	[0.60, '#fff3ea'],
	[0.55, '#fff5ef'],
	[0.50, '#fff7f5'],
	[0.45, '#fff9fb'],
	[0.40, '#fef9ff'],
	[0.35, '#f8f6ff'],
	[0.30, '#f3f2ff'],
	[0.25, '#eeefff'],
	[0.20, '#e9ecff'],
	[0.15, '#e4e9ff'],
	[0.10, '#dfe5ff'],
	[0.05, '#dae2ff'],
	[0.00, '#d3ddff'],
	[-0.05, '#ccd8ff'],
	[-0.10, '#c4d2ff'],
	[-0.15, '#bbccff'],
	[-0.20, '#b2c5ff'],
	[-0.25, '#aabfff'],
	[-0.30, '#a3b9ff'],
	[-0.35, '#9eb5ff'],
	[-0.40, '#9bb2ff']
]

function computeColorBV(bvIndex) {
	let leastDiff;
	let leastColor;
	for(let entry of COLOR_INDEXES) {
		let diff = Math.abs(entry[0] - bvIndex);
		if(leastDiff === undefined || diff < leastDiff) {
			leastDiff = diff;
			leastColor = entry[1];
		}
	}
	console.log(leastColor);
	return leastColor;
}