#include "gamemanager.h"

void initGameManager() {
    _entityIncrement = 0;
    initEntityList(&_gameEntities, 10);

    _universeClock = 0.0;
}