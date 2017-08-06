/**
 * The Logic Module:
 * 
 * Handles most root logic and processing.
 * 
 * @module Sourcebound/LogicModule
 */
var LogicM = (function() {

	/** When an entity is created, use this number as its ID then increment it +1 */
	var _idIncrement = 0;

	/** Container of all game entities, indexed by their ID integer */
	var _gameEntities = {};

	/** The name of the star system the player is currently viewing */
	var _viewingSystem = '';

	/** The entity the player is currently tracking / focused on */
	var _target = undefined;

	/** The number of seconds that have passed since the J2000 Epoch */
	var _universeClock = 0;

	return {

		/**
		 * Get the entity the player is currently focused on
		 * @return {Entity}
		 * 		The entity the player is currently focused on
		 */
		getTarget: function() {
			return _target;
		},

		/**
		 * Get the current universe clock
		 * @return {number}
		 * 		Seconds since the J2000 epoch
		 */
		getUniverseClock: function() {
			return _universeClock;
		},

		/**
		 * Get the currently-viewed system
		 * @return {string}
		 * 		The name of the currently-viewed star system
		 */
		getViewingSystem: function() {
			return _viewingSystem;
		},

		/**
		 * Get the list of active entities
		 * @return {Array.<Entity>}
		 * 		Array of active entities
		 */
		getGameEntities: function() {
			return _gameEntities;
		},

		/**
		 * Get a list of game entities by name search
		 * 	[O(n) complexity]
		 * @param {string} name
		 * 		The name to search for
		 * @return {Array.<Entity>}
		 * 		Array of entities with the specified name
		 */
		getEntitiesByName: function(name) {
			let entities = [];
			let entity;
			for(let index = 0, len = _gameEntities.length; index < len; index++) {
				entity = _gameEntities[index];
				if(entity.name === name) {
					entities.push(entity);
				}
			}
			return entities;
		},

		/**
		 * Get a list of game entities by eClass.
		 * 	[O(n) complexity]
		 * @param {number} eClass
		 * 		The eClass to search for
		 * @param {boolean} [exact=false]
		 * 		If true, perform an EQUALS search, not an AND search 
		 * @return {Array.<Entity>}
		 * 		Array of entities with the specified class
		 */
		getEntitiesByClass: function(eClass, exact) {
			let entities = [];
			let entity;
			for(let index = 0, len = _gameEntities.length; index < len; index++) {
				entity = _gameEntities[index];
				if((exact && entity.eClass === eClass) || (!exact && (entity.eClass & eClass))) {
					entities.push(entity);
				}
			}
			return entities;
		},

		/**
		 * Get an entity by its specific ID number
		 * 	[O(1) complexity]
		 * @param {number} ID
		 * 		The ID to select
		 * @return {Entity}
		 * 		The entity at the specified ID
		 */
		getEntityByID: function(ID) {
			return _gameEntities[ID];
		},

		/**
		 * Register an entity and assign it an ID
		 * @param {Entity} entity
		 * 		The new entity to register
		 */
		addEntity: function(entity) {
			entity.ID = _idIncrement++;
			_gameEntities[entity.ID] = entity;
		},

		/**
		 * Change the currently-viewed system
		 * @param {string} system
		 * 		The new system to view
		 */
		setViewingSystem: function(system) {
			_viewingSystem = system;
		},

		/** 
		 * Advance time by a given increment
		 * @param {number} dT
		 * 		Delta time - the size of the time increment (in seconds)
		 */
		clockForward: function(dT) {
			_universeClock += dT;

			let entity;
			for(let i = 0; i < _idIncrement; i++) {
				entity = _gameEntities[i];
				if(!entity.inactive) {

					// Advance orbit
					if(entity.orbit) {
						const newPos = entity.orbit.computeCoordinates(_universeClock);
						entity.setPos(newPos.xPos, newPos.yPos);
						//entity.orbit.update(_universeClock);
					}

				}
			}
		},

		/**
		 * Set the clock to a specific point in time
		 * @param {number} time
		 * 		Number of seconds relative to the J2000 epoch
		 */
		clockSet: function(time) {
			_universeClock = time;
			this.clockForward(0);
		}

	};

}());
