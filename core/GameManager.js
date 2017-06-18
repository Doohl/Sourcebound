var GameM; // static GameManager container

/**
	The main game manager, handles most logic and processing
*/
class GameManager {
	constructor() {
		GameM = this;

		/* When an entity is created, use this number as its ID-string and increment this value + 1 */
		GameM._entityIncrement = 0;

		/* Container of all game entities indexed by their ID-strings */
		GameM._gameEntities = {};

		/* Arrays containing game entities to render, indexed by Star System ID-strings */
		GameM._renderEntities = {};

		/* Stars that have been generated thus far */
		GameM.generatedStars = [];

		/* The star system the player is currently viewing */
		GameM.viewingSystem = "test";

		/* Entity the player is currently focused on / tracking */
		GameM.target = undefined;

		/* How many seconds have gone by in the universe. in seconds */
		GameM.universeClock = 0;
	}

	/**
		Assign an entity its ID-string and add it to the global list
	*/
	addEntity(pEntity) {
		if(pEntity === undefined) return;

		pEntity.ID = (GameM._entityIncrement++).toString();

		GameM._gameEntities[pEntity.ID] = pEntity;
	}

	/**
		Make the entity visible; move it to a specified Star System
			- pEntity must have `canRender` member set
	*/
	visibleEntity(pEntity, pSystem) {
		if(pEntity === undefined || pEntity.ID === undefined || !pEntity.canRender || pSystem === undefined) return;

		if(!GameM._renderEntities[pSystem]) {
			GameM._renderEntities[pSystem] = [pEntity];
		} else {
			GameM._renderEntities[pSystem].push(pEntity);
		}
	}

	/**
		Get the render entities of a specific star system
	*/
	getRenderEntities(pSystem) {
		return GameM._renderEntities[pSystem];
	}

	/**
		Remove an entity from the game
	*/

	/**
		Advance the clock by [time] seconds
	*/
	clockForward(time) {
		GameM.universeClock += time;
		for(let ID in GameM._gameEntities) {
			let entity = GameM._gameEntities[ID];

			// Advance orbit
			if(entity.orbit) {
				let newCoords = entity.computeCoordinates(GameM.universeClock);
				entity.xPos = newCoords.xPos;
				entity.yPos = newCoords.yPos;
				entity.orbitVelocity = newCoords.velocity;
			}
		}
	}

	clockSet(time) {
		GameM.universeClock = time;
		GameM.clockForward(0);
	}

	/**
		Rough estimate of time needed to reach entity B from entity A.
			- entityA: starting entity / location
			- entityB: ending entity / location
			- initialVel: velocity to start with
			- maximumVel: maximum cruising velocity
			- stopVel: velocity to stop at
			- acceleration: entity's acceleration / deceleration factor
		Returns:
		{
			'time': total trip time
			'dist': distance travelled
			'velocity': final recorded velocity
			'accelerationTime': time spent accelerating
			'decelerationTime': time spent decelerating
		}
	*/
	travelTime(entityA, entityB, initialVel, maximumVel, stopVel, acceleration) {
		let curDist = 0;
		let endDist = Math.round(Math.sqrt((entityB.xPos - entityA.xPos)**2 + (entityB.yPos - entityA.yPos)**2));
		console.log(endDist);
		let curVel = 0;
		let time = 0;
		let accelerationTime = 0;
		let decelerationTime = 0;
		let decelerating = false;
		while((endDist - curDist) > 0) {
			time++;
			let distRemaining = endDist - curDist;
			let stoppingDist = endDist - (maximumVel / 2) + ((stopVel**2 - curVel**2) / (2*acceleration));

			// Do not need to start decelerating, and do not accelerate if decelerating
			if(curDist < stoppingDist && !decelerating) {
				// Haven't yet reached maximumVel
				if(curVel < maximumVel) {
					accelerationTime++;
					curVel = Math.min(curVel + acceleration, maximumVel);
					curDist += curVel;

				// Have reached maximum velocity
				} else {
					time += ((stoppingDist - curDist)/maximumVel);
			        curDist += stoppingDist + (maximumVel / 2);
			        decelerating = true;
				}

			// Need to begin decelerating
			} else {
				decelerating = true;
				if(curVel > stopVel) {
					decelerationTime++;
					curVel = Math.max(curVel - acceleration, stopVel);
				}
				curDist += curVel;
			}
		}
		return {
			'time': time,
			'dist': curDist,
			'velocity': curVel,
			'accelerationTime': accelerationTime,
			'decelerationTime': decelerationTime
		};
	}

	/**
		Find the trajectory of shortest path from vessel A to entity B
	*/
	shortestVesselTrajectory(vesselA, entityB) {

		// Entity B is in orbit, want to find intercept trajectory
		if(entityB.orbit) {

		}
	}
}
new GameManager();
