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
}
new GameManager();
