const G_CONSTANT = 6.67408e-11;
const EARTH_YEAR = 3.154e+7; // seconds in an earth year
const EARTH_DAY = 86400; // seconds in an earth day
function NewtonApprox(max, previous, meanAnomaly, eccentricity, errorMargin) {
	let ret = previous;
	let retPrevious = previous;
	for(let i = 0; i < max; i++) {
		retPrevious = ret;
		ret = ret - (ret - eccentricity * Math.sin(ret) - meanAnomaly) / (1.0 - eccentricity * Math.cos(ret));
		if(Math.abs(ret - retPrevious) < errorMargin) {
			break;
		}
	}
	return ret;
}

/**
    A celestial body that has mass, an orbit and other geographic properties.
*/
class Celestial extends RenderEntity {
	constructor(pCoords, pRadius, pMass, pFillColor) {
		super(pCoords, pRadius, pFillColor);

        /* Elementary physical properties */
        this.mass = pMass || 0;  // mass in kilograms
	}

    /*
        Turn this celestial into a 2D orbital
    */
    makeOrbital(focus, periapsis, apoapsis, clockwiseOrbit) {
        if(!focus) return;

		let orbit				= {};
		orbit.focus				= focus;

		// Orbital minimum and maximum
		orbit.periapsis			= periapsis;
		orbit.apoapsis			= apoapsis;

		// Eccentricity (e): description of ellipse [0, 1]
		orbit.eccentricity 		= 1 - 2 / ((apoapsis/periapsis) + 1);

		// Semimajor Axis (a): sum of the periapsis and apoapsis divided by two
		orbit.semimajorAxis		= (periapsis + apoapsis) / 2;

		// Semiminor Axis (b): square root of periapsis times apoapsis
		orbit.semiminorAxis		= Math.sqrt(periapsis * apoapsis);

		// Orbital direction: true for clockwise, false for counterclockwise
		orbit.clockwiseOrbit = clockwiseOrbit;

		// Mean Angular Motion (n): s
		orbit.meanAngularMotion	= Math.sqrt((G_CONSTANT * (this.mass + focus.mass)) / ((orbit.semimajorAxis * 1000) ** 3));

		this.orbit = orbit;
    }

	/**
		Get the coordinates for the center of the ellipse representing the orbit
	*/
	getOrbitalCenter() {
		if(!this.orbit) return;

		return {
			'xPos': this.orbit.focus.xPos - (this.orbit.eccentricity * this.orbit.semimajorAxis),
			'yPos': this.orbit.focus.yPos
		};
	}

	/**
		Compute the True Anomaly (theta) of the orbit at [time]
	*/
	computeTrueAnomaly(time) {
		if(!this.orbit) return; // must be an orbital

		// Mean Anomaly (M): mean angular motion times [time]
		const meanAnomaly = this.orbit.meanAngularMotion * time;

		// Eccentric Anomaly (E): angular parameter that defines position of celestial along orbit
		let eccentricAnomaly;

		// Orbits of e>0.8, initial value of pi is used
		if(this.orbit.eccentricity > 0.8) {
			eccentricAnomaly = NewtonApprox(150, Math.PI, meanAnomaly, this.orbit.eccentricity, 10e-15);
		} else {
			eccentricAnomaly = NewtonApprox(150, meanAnomaly, meanAnomaly, this.orbit.eccentricity, 10e-15);
		}

		// return the True Anomaly
		if(this.orbit.clockwiseOrbit) {
			return 2 * Math.atan2(
				Math.sqrt(1 + this.orbit.eccentricity) * Math.sin(eccentricAnomaly / 2),
				Math.sqrt(1 - this.orbit.eccentricity) * Math.cos(eccentricAnomaly / 2)
			);
		} else {
			return 2 * Math.atan2(
				Math.sqrt(1 - this.orbit.eccentricity) * Math.cos(eccentricAnomaly / 2),
				Math.sqrt(1 + this.orbit.eccentricity) * Math.sin(eccentricAnomaly / 2)
			);
		}
	}

	/**
		Compute the (x, y) coordinates of this celestial at a given [time] in seconds
	*/
	computeCoordinates(time) {
		if(!this.orbit) return;

		let trueAnomaly = this.computeTrueAnomaly(time);
		const distance = (this.orbit.semimajorAxis * 1000) * ((1 - this.orbit.eccentricity**2) / (1 + this.orbit.eccentricity * Math.cos(trueAnomaly)));

		// Tangential velocity
		const velocity = Math.sqrt(G_CONSTANT * (this.mass + this.orbit.focus.mass) * (this.orbit.semimajorAxis * 1000)) / distance;

		// return the final coordinates
		return {
			'xPos': this.orbit.focus.xPos + (distance / 1000) * Math.cos(trueAnomaly), // convert from m to km
			'yPos': this.orbit.focus.yPos + (distance / 1000) * Math.sin(trueAnomaly), // convert from m to km
			'velocity': velocity / 1000 // convert from m/s to km/s
		};
	}
}
