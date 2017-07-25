var GameM; // static GameManager container

/**
	The main game manager, handles most logic and processing
*/
class GameManager {
	constructor() {
		GameM = this;

		/* When an entity is created, use this number as its ID-string and increment this value + 1 */
		GameM._entityIncrement = 0;

		/* Container of all game entities indexed by their IDs */
		GameM._gameEntities = {};

		/* Arrays containing game entities to render, indexed by Star System IDs */
		GameM._renderEntities = {};

		/* Stars that have been generated thus far */
		GameM.generatedStars = [];

		/* The star system the player is currently viewing */
		GameM.viewingSystem = "test";

		/* Entity the player is currently focused on / tracking */
		GameM.target = undefined;

		/* The number of seconds that have passed since the J2000 Epoch */
		GameM.universeClock = 0;
	}

	/**
		Assign an entity its ID and add it to the global list
	*/
	addEntity(pEntity) {
		if(pEntity === undefined) return;

		pEntity.ID = GameM._entityIncrement++;

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
		const newTime = GameM.universeClock;
		
		for(let i = 0, l = GameM._entityIncrement; i < l; i++) {
			const entity = GameM._gameEntities[i];

			if(!entity.graveyard) {
				// Advance orbit
				if(entity.orbit) {
					let newCoords = entity.computeCoordinates(newTime);
					entity.xPos = newCoords.xPos;
					entity.yPos = newCoords.yPos;
					entity.graphics.position.set(entity.xPos, entity.yPos);
				}

				// Check for flight solutions
				//if(entity.flightSolution) {
				//	entity.flightSolution(time);
				//}
			}
		}
	}

	clockSet(time) {
		GameM.universeClock = time;
		GameM.clockForward(0);
	}

	/**
		Calculate time [seconds] needed to move from pointA to pointB along a Brachistochrone Trajectory
	*/
	travelTime(pointA, pointB, gForce) {
		const dist = Math.sqrt((pointB.xPos - pointA.xPos)**2 + (pointB.yPos - pointB.xPos)**2);
		return 2 * Math.sqrt(dist / gForce);
	}
}
new GameManager();
