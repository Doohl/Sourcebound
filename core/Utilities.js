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
		Tween equations:
			t - current time
			b - start value
			c - change in value
			d - total duration
	*/
	linearTween(t, b, c, d) {
		return c*t/d + b;
	}

}

new Utilities();
