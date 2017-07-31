
/**
 * A table describing a celestial body's physical properties
 * 
 * @typedef {Object} CelestialProperties
 * @property {string} system - The name of the system this celestial belongs to
 * @property {string} name - The celestial's name
 * @property {number} mass - The celestial's mass, in kg
 * @property {number} radius - The celestial's (average) radius, in km
 * @property {number} tilt - The celestial's axial tilt, in radians
 * @property {number} rotationalPeriod - How long it takes for this celestial to completely rotate, in hours
 * @property {Array} [hydrosphere] - The celestial's combined liquids
 * @property {Object} [atmosphere] - The celestial's combined gasses
 * @property {KeplerOrbit} [orbit] - The celestial's orbit container
 */

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
	 */
	constructor(props, displayProps) {
		super(props.name, {xPos: 0, yPos: 0, system: props.system}, color);

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
