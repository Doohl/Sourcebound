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
	constructor(pProps, pFillColor) {
		super(
			pProps.name,
			{'xPos': pProps.xPos, 'yPos': pProps.yPos, 'system': pProps.system},
			pProps.mass, pProps.radius, pFillColor
		);

		/* Natural satellites directly orbiting this celestial */
		this.satellites = [];

		/* Standard gravitational parameter */
		this.standardGrav = Util.G_CONSTANT * this.mass;

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
			- omega: longitude of periapsis, defines location of the periapsis relative to focus (radians)
			- clockwise: define as true if orbit moves clockwise (false / undefined for counterclockwise)
			- epochAnomaly: the mean anomaly of this celestial at the J2000 epoch
    */
	makeOrbital(orbit) {
		if(!orbit) return;

		// Eccentricity (e): description of ellipse [0, 1]
		orbit.eccentricity 		= 1 - 2 / ((orbit.apoapsis / orbit.periapsis) + 1);

		// Semimajor Axis (a): sum of the periapsis and apoapsis divided by two
		orbit.semimajorAxis		= (orbit.periapsis + orbit.apoapsis) / 2;

		// Semiminor Axis (b): square root of periapsis times apoapsis
		orbit.semiminorAxis		= Math.sqrt(orbit.periapsis * orbit.apoapsis);

		// Sum of the standard gravitational parameters
		orbit.standardGravTotal	= this.standardGrav + orbit.focus.standardGrav;

		// Mean Angular Motion (n): function of the angular motion with respect to time
		orbit.meanAngularMotion	= Math.sqrt(orbit.standardGravTotal / ((orbit.semimajorAxis * 1000) ** 3));
		if(!orbit.clockwise) {
			orbit.meanAngularMotion *= -1; // flip the direction of travel if retrograde movement
		}

		// Orbital period: time it takes to perform one orbit, in years
		orbit.period			= Math.sqrt( (orbit.semimajorAxis / 1.496e+8)**3 ); // convert a[km] to a[AU]

		orbit.epochAnomaly		= orbit.epochAnomaly || 0;

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
		let rotatedPoint = Util.rotatePoint({'xPos': x, 'yPos': y}, this.orbit.focus.xPos, this.orbit.focus.yPos, -this.orbit.omega);

		return {
			'xPos': rotatedPoint.xPos,
			'yPos': rotatedPoint.yPos
		};
	}

	/**
		Compute the Eccentric Anomaly (E) of the orbit at [mean anomaly]
	*/
	computeEccentricAnomaly(meanAnomaly) {
		let eccentricAnomaly;

		// Orbits of e>0.8, initial value of pi is used
		if(this.orbit.eccentricity > 0.9) {
			eccentricAnomaly = NewtonApprox(1000, Math.PI, meanAnomaly, this.orbit.eccentricity, 10e-15);
		} else if(this.orbit.eccentricity > 0.8) {
			eccentricAnomaly = NewtonApprox(500, Math.PI, meanAnomaly, this.orbit.eccentricity, 10e-15);
		} else {
			eccentricAnomaly = NewtonApprox(150, meanAnomaly, meanAnomaly, this.orbit.eccentricity, 10e-15);
		}

		return eccentricAnomaly;
	}

	/**
		Compute the Mean Anomaly (M) at [time]
	*/
	computeMeanAnomaly(time) {
		return (this.orbit.meanAngularMotion * time) - this.orbit.epochAnomaly;
	}

	/**
		Compute the True Anomaly (theta) of the orbit at [time]
	*/
	computeTrueAnomaly(time) {
		if(!this.orbit) return; // must be an orbital

		// Mean Anomaly (M): mean angular motion times [time]
		const meanAnomaly = this.computeMeanAnomaly(time);

		// Eccentric Anomaly (E): angular parameter that defines position of celestial along orbit
		let eccentricAnomaly = this.computeEccentricAnomaly(meanAnomaly);

		// return the True Anomaly
		return 2 * Math.atan2(
			Math.sqrt(1 + this.orbit.eccentricity) * Math.sin(eccentricAnomaly / 2),
			Math.sqrt(1 - this.orbit.eccentricity) * Math.cos(eccentricAnomaly / 2)
		);
	}

	/**
		Compute the (x, y) coordinates of this celestial at a given [time] in seconds
	*/
	computeCoordinates(time, detailed) {
		if(!this.orbit) return;

		let trueAnomaly = this.computeTrueAnomaly(time);
		const distance = (this.orbit.semimajorAxis * 1000) * ((1 - this.orbit.eccentricity**2) / (1 + this.orbit.eccentricity * Math.cos(trueAnomaly)));

		let x = this.orbit.focus.xPos + (distance / 1000) * Math.cos(trueAnomaly); // convert from m to km
		let y = this.orbit.focus.yPos + (distance / 1000) * Math.sin(trueAnomaly); // convert from m to km

		let rotatedPoint = Util.rotatePoint({'xPos': x, 'yPos': y}, this.orbit.focus.xPos, this.orbit.focus.yPos, -this.orbit.omega);

		// return the final coordinates
		if(!detailed) {
			return {
				'xPos': rotatedPoint.xPos,
				'yPos': rotatedPoint.yPos
			};

		// Return detailed orbital information, as well as coordinates
		} else {
			let eccentricAnomaly = this.computeEccentricAnomaly(this.computeMeanAnomaly(time));

			// Instantaneous orbital velocity
			const velocity = Math.sqrt(this.orbit.standardGravTotal * (this.orbit.semimajorAxis * 1000)) / distance / 1000; // convert m/s to km/s

			// Velocity Vector
			let vel2D = new Vector(
				-velocity * Math.sqrt(1 - this.orbit.eccentricity**2) * Math.cos(eccentricAnomaly),
				-velocity * Math.sin(eccentricAnomaly)
			);
			return {
				'xPos': rotatedPoint.xPos,
				'yPos': rotatedPoint.yPos,
				'velocity': vel2D
			};
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
