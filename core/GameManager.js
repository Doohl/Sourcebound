var gameM; // static GameManager container

/**
	The main game manager, handles most logic and processing
*/
class GameManager {
	constructor() {
		gameM = this;

		/* When an entity is created, use this number as its ID-string and increment this value + 1 */
		gameM._entityIncrement = 0;

		/* Container of all game entities indexed by their ID-strings */
		gameM._gameEntities = {};

		/* Arrays containing game entities to render, indexed by Star System ID-strings */
		gameM._renderEntities = {};

		/* The star system the player is currently viewing */
		gameM.viewingSystem = "test";

		/* Entity the player is currently focused on / tracking */
		gameM.target = undefined;

		/* How many seconds have gone by in the universe. in seconds */
		gameM.universeClock = 0;
	}

	/**
		Assign an entity its ID-string and add it to the global list
	*/
	addEntity(pEntity) {
		if(pEntity === undefined) return;

		pEntity.ID = (gameM._entityIncrement++).toString();

		gameM._gameEntities[pEntity.ID] = pEntity;
	}

	/**
		Make the entity visible; move it to a specified Star System
			- pEntity must have `canRender` member set
	*/
	visibleEntity(pEntity, pSystem) {
		if(pEntity === undefined || pEntity.ID === undefined || !pEntity.canRender || pSystem === undefined) return;

		if(!gameM._renderEntities[pSystem]) {
			gameM._renderEntities[pSystem] = [pEntity];
		} else {
			gameM._renderEntities[pSystem].push(pEntity);
		}
	}

	/**
		Get the render entities of a specific star system
	*/
	getRenderEntities(pSystem) {
		return gameM._renderEntities[pSystem];
	}

	/**
		Remove an entity from the game
	*/

	/**
		Advance the clock by [time] seconds
	*/
	clockForward(time) {
		gameM.universeClock += time;
		for(let ID in gameM._gameEntities) {
			let entity = gameM._gameEntities[ID];

			// Advance orbit
			if(entity.orbit) {
				let newCoords = entity.computeCoordinates(gameM.universeClock);
				entity.xPos = newCoords.xPos;
				entity.yPos = newCoords.yPos;
				entity.orbitVelocity = newCoords.velocity;
			}
		}
	}
}
new GameManager();
