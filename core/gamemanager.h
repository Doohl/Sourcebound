#ifndef GAMEMANAGER_H
#define GAMEMANAGER_H

#include "entities/entitylist.h"

/* When an entity is created, use this number as its ID-string and increment this value + 1 */
size_t _entityIncrement;

/* Container of all game entities indexed by their IDs */
EntityList _gameEntities;

/* The number of seconds that have passed since the J2000 Epoch */
uint64_t _universeClock;



/* 
    Initialize the Game Manager 
*/
void initGameManager();

/* Public-facing getters */
#define GL_getGameEntities() _gameEntities
uint64_t GM_getUniverseClock();


/*
    Register an entity in the Game Manager
*/
void GM_registerEntity(Entity *entity);

/*
    Forward the universal clock by a given offset (in seconds)
*/
void GM_clockForward(uint64_t time);

#endif