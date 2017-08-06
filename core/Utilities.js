


var Util;

/**
	Utility container, handles frequently-used logic as well as any miscellaneous constants
*/
class Utilities {
	constructor() {
		Util = this;

        /* Rendering constants */
        // The maximum allowed ellipse semimajor axis
        Util.MAX_ELLIPSE_SEMIMAJOR = 603367;

        // Maximum allowed distance from a star system's center
        Util.STARSYSTEM_EDGE = 2.244e+10; // about 150 AU

        /* Celestial constants */
        Util.G_CONSTANT = 6.67408e-11;  // gravitational constant [m^3 kg^-1 s^-2]
        Util.EARTH_YEAR = 3.154e+7;     // seconds in an earth year
        Util.EARTH_DAY = 86400;         // seconds in an earth day

		/* Conversions */
		Util.AU = 1.496e+8;				// 1 AU to km
		Util.DEG = 0.0174533;			// 1 degree to radians

		// Number of milliseconds between the Unix epoch and J2000 Epoch
		Util.J2000_UNIX = Date.parse('Sat, 01 Jan 2000 12:00:00 GMT');
	}

    /**
        Rotate a point along an x and y origin
    */
    rotatePoint(pPoint, xOrigin, yOrigin, pAngle) {
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
        Generate a random integer from [min] to [max]
    */
    randomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
        Roll a dice
    */
    roll(dice) {
        let number = 0;
        let sides = 0;
        let data = dice.split('d');
        if(data[0] === '') {
            number = 1;
        } else {
            number = parseInt(data[0]);
        }
        if(data[1] === '') {
            sides = 6;
        } else {
            sides = parseInt(data[1]);
        }
        let value = 0;
        for(let i = 0; i < number; i++) {
            value += Util.randomInt(1, sides);
        }
        return value;
    }

	/**
		Get an angle between two points
	*/
	getAngle(pointA, pointB) {
		let result = Math.atan2(pointA.yPos - pointB.yPos, pointB.xPos - pointA.xPos);
		if(result > 2 * Math.PI) {
			result -= 2 * Math.PI;
		}
		if(result < 0) {
			result += 2 * Math.PI;
		}
		return result;
	}


	/**
		Tween equations:
			t - current time
			b - start value
			c - change in value
			d - total duration
	*/
	linearTween(t, b, c, d) {
		return c*t/d + b;
	}

	/**
		Gets a string representation of the current universe clock
	*/
	getStringDate(time) {
		let currentDate = new Date();
		currentDate.setTime(Util.J2000_UNIX + (time * 1000)); // convert seconds to milliseconds
		return currentDate.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	toRad(degrees) {
		return degrees * Math.PI / 180;
	}
}

new Utilities();
