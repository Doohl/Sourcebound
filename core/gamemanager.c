#include <webassembly.h>

#include "gamemanager.h"

void initGameManager() {
    _entityIncrement = 0;
    initEntityList(&_gameEntities, 10);
    _universeClock = 0;

    console_log("Successfully initialized the Game Manager!");
}

void GM_registerEntity(Entity *entity) {
    entity->id = _entityIncrement++;
    pushList(&_gameEntities, entity);
}

uint64_t GM_getUniverseClock() {
    return _universeClock;
}

void GM_clockForward(uint64_t time) {
    _universeClock += time;

    for(size_t index = 0, l = _gameEntities.size; index < l; index++) {
        Entity *entity = _gameEntities.array[index];
        if(entity != 0 && !entity->deactivated) {
            if(entity->definedOrbit) {
                processOrbit(&(entity->orbit), entity, _universeClock);
            }
        }
    }
}