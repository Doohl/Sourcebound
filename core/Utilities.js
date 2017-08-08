/**
 * The Utility Module:
 * 
 * Handles miscellaneous constants, commonly-used functions...
 * 
 * @module Sourcebound/UtilityModule
 */
var Util = (function() {

	return {

		/** The maximum allowed ellipse semimajor axis [pixels] */
		MAX_ELLIPSE_SEMIMAJOR: 2000,

		/** The maximum allowed distance from a star system's center (~150 AU) */
		STARSYSTEM_EDGE: 2.244e+10,

		/** The gravitational constant [m^3 kg^-1 s^-2] */
		G_CONSTANT: 6.67408e-11,

		/** Number of seconds in an earth day */
		EARTH_DAY: 86400,

		/** Number of seconds in an earth year */
		EARTH_YEAR: 3.154e+7,

		/** Conversion factor from AU to km */
		AU: 1.496e+8,

		/** Conversion factor from degrees to radians */
		DEG: 0.0174533,

		/** Number of milliseconds between the Unix epoch and J2000 Epoch */
		J2000_UNIX: Date.parse('Sat, 01 Jan 2000 12:00:00 GMT'),

		/**
		 * Rotate a point along an x and y origin
		 * @param {Point} pPoint
		 * 		The point to rotate
		 * @param {number} xOrigin
		 * 		The x origin to rotate about
		 * @param {number} yOrigin
		 * 		The y origin to rotate about
		 * @param {number} pAngle
		 * 		The angle to rotate with
		 * @return {Point}
		 * 		The new rotated point
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
		},

		/**
		 * Generate a random number between the specified maximum and minimum
		 * @param {number} min
		 * 		The minimum bound
		 * @param {number} max
		 * 		The maximum bound
		 * @return {number}
		 * 		A random number between `min` and `max`
		 */
		randomInt(min, max){
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		/**
		 * Execute a dice roll and return the value
		 * @param {string} [dice='d6']
		 * 		A dice roll string, ie "2d6" or "d20"
		 * @return {number}
		 * 		The result of the dice roll
		 */
		roll(dice='d6') {
			let data = dice.split('d'),
				number = parseInt(data[0]) || 1,
				sides = parseInt(data[1]) || 6,
				value = 0;
			
			for(let i = 0; i < number; i++) {
				value += this.randomInt(1, sides);
			}
			return value;
		},

		/**
		 * Get the angle between two points
		 * @param {Point} pointA
		 * 		The point of origin
		 * @param {Point} pointB
		 * 		The target point
		 * @return {number}
		 * 		The angle, in radians, from `pointA` to `pointB`
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
		},

		/**
		 * Gets a string representation of the input time
		 * @param {number} time
		 * 		An input time
		 * @return {string}
		 * 		Date string
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
		},

		/**
		 * Convert degrees to radians
		 * @param {number} degrees
		 * 		Input degrees
		 * @return {number}
		 * 		Output radians
		 */
		toRad(degrees) {
			return degrees * Math.PI / 180;
		},

		/**
		 * Convert km (kilometers) to AU (astronomical units)
		 * @param {number} km
		 * 		Input km
		 * @return {number}
		 * 		Output AU
		 */
		toAU(km) {
			return km * this.AU;
		},

		/** 
		 * A collection of easing functions 
		 */
		easing: {
			/**
			 * A linear interpolation function
			 * @param {number} t
			 * 		The current time [frames | milliseconds]
			 * @param {number} b
			 * 		The start value
			 * @param {number} c
			 * 		The change in value
			 * @param {number} d
			 * 		The total duration [frames | milliseconds]
			 * @return {number}
			 * 		The value at the given time
			 */
			linear(t, b, c, d) {
				return c*t/d + b;
			}
		}
		
	};

}());
