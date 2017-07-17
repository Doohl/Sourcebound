#include <webassembly.h>

#include "uimanager.h"

void initUIManager() {
    console_log("Successfully initialized the UI Manager!");
}

double UI_screenXToReal(const double x) {
    double canvasCenterX = __canvasWidth / 2;

    return ((_cameraX * _cameraZoom) + (x - canvasCenterX)) / _cameraZoom;
}

double UI_screenYToReal(const double y) {
    double canvasCenterY = __canvasHeight / 2;

    return ((_cameraY * _cameraZoom) + (y - canvasCenterY)) / _cameraZoom;
}