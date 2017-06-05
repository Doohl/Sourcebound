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
}

new Utilities();
