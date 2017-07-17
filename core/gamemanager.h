#ifndef GAMEMANAGER_H
#define GAMEMANAGER_H

#include "entities/entitylist.h"

/* When an entity is created, use this number as its ID-string and increment this value + 1 */
size_t _entityIncrement;

/* Container of all game entities indexed by their IDs */
EntityList _gameEntities;

/* The number of seconds that have passed since the J2000 Epoch */
double _universeClock;


/* Initialize the game manager */
void initGameManager();

#endif