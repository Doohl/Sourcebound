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

function rotatePoint(pPoint, xOrigin, yOrigin, pAngle) {
	let sin = Math.sin(pAngle);
	let cos = Math.cos(pAngle);

	pPoint.xPos -= xOrigin;
	pPoint.yPos -= yOrigin;

	let xNew = pPoint.xPos * cos - pPoint.yPos * sin;
	let yNew = pPoint.xPos * sin + pPoint.yPos * cos;

	pPoint.xPos = xNew + xOrigin;
	pPoint.yPos = yNew + yOrigin;
	return pPoint;
}

/**
    A celestial body that has mass, an orbit and other geographic properties.
*/
class Celestial extends RenderEntity {
	constructor(pProps, pFillColor) {
		super(
			pProps.name,
			{'xPos': pProps.xPos, 'yPos': pProps.yPos, 'system': pProps.system},
			pProps.mass, pProps.radius, pFillColor
		);

		this.satellites = [];		// celestials directly orbiting this celestial

		if(pProps.orbit) {
			this.makeOrbital(pProps.orbit);
		}
	}

    /*
        Turn this celestial into a 2D orbital
		input [orbit] Properties:
			- focus: the entity to orbit around
			- periapsis: the closest distance to the focus (kilometers)
			- apoapsis: the furthest distance to the focus (kilometers)
			- omega: argument of periapsis, defines location of the periapsis relative to focus (radians)
			- clockwise: define as true if orbit moves clockwise (false / undefined for counterclockwise)
    */
	makeOrbital(orbit) {
		if(!orbit) return;

		// Eccentricity (e): description of ellipse [0, 1]
		orbit.eccentricity 		= 1 - 2 / ((orbit.apoapsis / orbit.periapsis) + 1);

		// Semimajor Axis (a): sum of the periapsis and apoapsis divided by two
		orbit.semimajorAxis		= (orbit.periapsis + orbit.apoapsis) / 2;

		// Semiminor Axis (b): square root of periapsis times apoapsis
		orbit.semiminorAxis		= Math.sqrt(orbit.periapsis * orbit.apoapsis);

		// Mean Angular Motion (n): function of the angular motion with respect to time
		orbit.meanAngularMotion	= Math.sqrt((G_CONSTANT * (this.mass + orbit.focus.mass)) / ((orbit.semimajorAxis * 1000) ** 3));
		if(!orbit.clockwise) {
			orbit.meanAngularMotion *= -1; // flip the direction of travel if retrograde movement
		}

		// Orbital period: time it takes to perform one orbit, in years
		orbit.period = Math.sqrt( (orbit.semimajorAxis / 1.496e+8)**3 ); // convert a[km] to a[AU]

		orbit.focus.satellites.push(this);

		this.orbit = orbit;
    }

	/**
		Get the coordinates for the center of the ellipse representing the orbit
	*/
	getOrbitalCenter() {
		if(!this.orbit) return;

		let x = this.orbit.focus.xPos - (this.orbit.eccentricity * this.orbit.semimajorAxis);
		let y = this.orbit.focus.yPos;
		let rotatedPoint = rotatePoint({'xPos': x, 'yPos': y}, this.orbit.focus.xPos, this.orbit.focus.yPos, -this.orbit.omega);

		return {
			'xPos': rotatedPoint.xPos,
			'yPos': rotatedPoint.yPos
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
		return 2 * Math.atan2(
			Math.sqrt(1 + this.orbit.eccentricity) * Math.sin(eccentricAnomaly / 2),
			Math.sqrt(1 - this.orbit.eccentricity) * Math.cos(eccentricAnomaly / 2)
		);
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

		let x = this.orbit.focus.xPos + (distance / 1000) * Math.cos(trueAnomaly); // convert from m to km
		let y = this.orbit.focus.yPos + (distance / 1000) * Math.sin(trueAnomaly); // convert from m to km

		let rotatedPoint = rotatePoint({'xPos': x, 'yPos': y}, this.orbit.focus.xPos, this.orbit.focus.yPos, -this.orbit.omega);

		// return the final coordinates
		return {
			'xPos': rotatedPoint.xPos,
			'yPos': rotatedPoint.yPos,
			'trueAnomaly': trueAnomaly,
			'velocity': velocity / 1000 // convert from m/s to km/s
		};
	}

	/**
		Focus the camera on the celestial when clicked on
	*/
	onClick(event) {
		gameM.target = this;
	}
}
