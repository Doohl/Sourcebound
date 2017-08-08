
/**
 * A table describing a celestial body's orbital properties
 * 
 * @typedef {Object} OrbitalElements
 * @property {number} semimajorAxis - (a) The orbit's semimajor axis in km
 * @property {number} eccentricity - (e) The orbit's eccentricity
 * @property {number} epochTime - This orbit's epoch, as number of seconds since Epoch J2000
 * @property {number} epochAnomaly - (n) This orbit's mean anomaly at the defined epochTime in deg
 * @property {number} [lPeriapsis] - (ϖ) The orbit's longitude of the periapsis in deg.
 *         (If it's not defined, `lAscending` and `aPeriapsis` must be defined)
 * @property {number} [lAscending] - (Ω) The orbit's longitude of the ascending node in deg.
 *         (Must be defined if `lPeriapsis` is not defined)
 * @property {number} [aPeriapsis] - (ω) The orbit's argument of the periapsis in deg.
 *         (Must be defined if `lPeriapsis` is not defined)
 * @property {number} [inclination] - (i) The orbit's tilt to the invariable plane in deg. Not taken into consideration in our 2D Kepler calculations.
 * @property {number} [precession] - (ε) The orbit's apsidal precession in deg.
 * @property {boolean} [clockwise] - If true, the orbit will travel clockwise. Else, counter-clockwise.
 * 
 */

/**
 * A Class that organizes data for a 2D kepler orbit
 * (2 body simulation)
 */
class KeplerOrbit {

    /**
     * Orbit constructor method
     * @param {Entity} focus
     *      The entity this orbit is focused around
     * @param {Entity} parent
     *      The entity that is travelling along the orbit
     * @param {OrbitalElements} data
     *      An object containing some essential orbital characteristics
     */
    constructor(focus, parent, data) {

        this.focus = focus;
        
        /** Eccentricity (e): description of the ellipse */
        this.eccentricity = data.eccentricity;

        /** Semimajor Axis (a): sum of the periapsis and apoapsis divided by two */
        this.semimajorAxis = data.semimajorAxis;

        // The semimajor axis is probably in AU:
        if(this.semimajorAxis <= focus.radius) {
            this.semimajorAxis = Util.toKm(this.semimajorAxis);
        }

        /** Periapsis: the closest distance to the focus */
        this.periapsis = this.semimajorAxis * (1 - this.eccentricity);

        /** Apoapsis: the furthest distance from the focus */
        this.apoapsis = this.semimajorAxis * (1 + this.eccentricity);

        /** Semiminor Axis (b): square root of the periapsis times apoapsis */
        this.semiminorAxis = Math.sqrt(this.periapsis * this.apoapsis);

        this.aPeriapsis = Util.toRad(data.aPeriapsis);
        this.lAscending = Util.toRad(data.lAscending);

        /** Longitude of the Periapsis (ϖ): defines the location of the periapsis relative to the focus */
        if(data.lPeriapsis) {
            this.lPeriapsis = this.lPeriapsis;
        } else {
            this.lPeriapsis = this.lAscending + this.aPeriapsis;
        }

        /** Inclination (i): the tilt of an orbit around the focus celestial */
        this.inclination = Util.toRad(data.inclination);

        /** The sum of the standard gravitational parameters */
        this.standardGravTotal = focus.standardGrav + parent.standardGrav;

        /** Mean Angular Motion (n): function of the angular motion with respect to time */
        this.meanAngularMotion	= Math.sqrt(this.standardGravTotal / ((this.semimajorAxis * 1000) ** 3));
		if(!data.clockwise) {
			this.meanAngularMotion *= -1; // flip the direction of travel if retrograde movement
        }
        
        /** Orbital period (T): time for one revolution, in years */
        this.period = Math.sqrt( (this.semimajorAxis / 1.496e+8)**3 ); // convert a[km] to a[AU]
        
        /** The initial epoch elements */
        this.epochTime = data.epochTime;
        this.epochAnomaly = Util.toRad(data.epochAnomaly || 0);

        /** The apsidal precession [general relativity] (ε): a gradual rotation of the longitude of periapsis */
        if(data.precession) {
            this.precession = Util.toRad(data.precession);
        } else {
            this.precession = 0;
            //this.precession = 24 * Math.pow(Math.PI, 3) * Math.pow(this.semimajorAxis * 1000, 2) / ();
        }

        /** Add the parent to focus' list of satellites */
        focus.satellites.push(parent);

        parent.orbit = this;
    }

    /**
     * Get the coordinates for the center of the ellipse representing this orbit
     * @return {Point}
     *      The realspace coordinate for the orbit's center
     */
    getCenter() {
        let x = this.focus.xPos - (this.eccentricity * this.semimajorAxis);
		let y = this.focus.yPos;
		let rotatedPoint = Util.rotatePoint({xPos: x, yPos: y}, this.focus.xPos, this.focus.yPos, -this.lPeriapsis);

		return {
			xPos: rotatedPoint.xPos,
			yPos: rotatedPoint.yPos
		};
    }

    /**
     * Compute the Eccentric Anomaly (E) of the orbit at a specified mean anomaly
     * @param {number} meanAnomaly
     *      The input mean anomaly
     * @return {number}
     *      The Eccentric Anomaly at meanAnomaly
     */
    computeEccentricAnomaly(meanAnomaly) {
        let eccentricAnomaly;

		// Orbits of e>0.8, initial value of pi is used
		if(this.eccentricity > 0.9) {
			eccentricAnomaly = NewtonApprox(1000, Math.PI, meanAnomaly, this.eccentricity, 10e-15);
		} else if(this.eccentricity > 0.8) {
			eccentricAnomaly = NewtonApprox(500, Math.PI, meanAnomaly, this.eccentricity, 10e-15);
		} else {
			eccentricAnomaly = NewtonApprox(150, meanAnomaly, meanAnomaly, this.eccentricity, 10e-15);
		}

		return eccentricAnomaly;
    }

    /**
     * Compute the Mean Anomaly (M) at a specified time
     * @param {number} time
     *      The time since epoch in seconds
     * @return {number}
     *      The computed Mean Anomaly at time
     */
    computeMeanAnomaly(time) {
        return (this.meanAngularMotion * time) - this.epochAnomaly;
    }

    /**
     * Compute the True Anomaly (θ) at a specified time
     * @param {number} time
     *      The time since epoch in seconds
     * @return {number}
     *      The computed True Anomaly at time 
     */
    computeTrueAnomaly(time) {
		// Mean Anomaly (M): mean angular motion times [time]
		const meanAnomaly = this.computeMeanAnomaly(time);

		// Eccentric Anomaly (E): angular parameter that defines position of celestial along orbit
		const eccentricAnomaly = this.computeEccentricAnomaly(meanAnomaly);

		// return the True Anomaly
		return 2 * Math.atan2(
			Math.sqrt(1 + this.eccentricity) * Math.sin(eccentricAnomaly / 2),
			Math.sqrt(1 - this.eccentricity) * Math.cos(eccentricAnomaly / 2)
		);
    }
    
    /**
     * Compute the coordinates of the parent celestial at a specified time
     * @param {number} time
     *      The current universe time
     * @param {boolean} [detailed=false]
     *      If true, return velocity information as well as coordinates
     * @return {Point}
     *      The x, y coordinates of the parent
     */
    computeCoordinates(time, detailed) {
        // Grab the time relative to this orbit's epoch
        const timeSinceEpoch = time - this.epochTime;

        const trueAnomaly = this.computeTrueAnomaly(timeSinceEpoch);
        const distance = (this.semimajorAxis * 1000) * ((1 - this.eccentricity**2) / (1 + this.eccentricity * Math.cos(trueAnomaly)));
        
        const x = this.focus.xPos + (distance / 1000) * Math.cos(trueAnomaly); // convert from m to km
		const y = this.focus.yPos + (distance / 1000) * Math.sin(trueAnomaly); // convert from m to km

        const rotatedPoint = Util.rotatePoint({xPos: x, yPos: y}, this.focus.xPos, this.focus.yPos, -this.lPeriapsis);
        
        // Return orbital velocity as well as coordinates
        if(detailed) {
            let eccentricAnomaly = this.computeEccentricAnomaly(this.computeMeanAnomaly(timeSinceEpoch));

			// Instantaneous orbital velocity
			const velocity = Math.sqrt(this.standardGravTotal * (this.semimajorAxis * 1000)) / distance / 1000; // convert m/s to km/s

			// Velocity Vector
			rotatedPoint.velocity = new Vector(
				-velocity * Math.sqrt(1 - this.eccentricity**2) * Math.cos(eccentricAnomaly),
				-velocity * Math.sin(eccentricAnomaly)
			);
        }

        return rotatedPoint;
    }

}

/**
 * Perform a Newton Approximation for Eccentric Anomaly
 * @param {number} max
 *      The maximum number of computations before the algorithm stops
 * @param {number} previous
 *      The default Eccentric Anomaly
 * @param {number} meanAnomaly
 *      The input Mean Anomaly 
 * @param {number} eccentricity
 *      The eccentricity of the orbit 
 * @param {number} errorMargin 
 *      The minimum error margin before the algorithm stops and accepts the number
 * @return {number}
 *      Returns the approximate Eccentric Anomaly
 */
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
