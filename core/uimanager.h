#ifndef UIMANAGER_H
#define UIMANAGER_H

#include "entities/entity.h"

/* x, y coordinates of the player camera */
double _cameraX;
double _cameraY;

/* Default camera speed (for WASD / arrow key movement) */
double _cameraSpeed;

/* Zoom factor of the player camera */
double _cameraZoom;

/* Read-only canvas information */
double __canvasWidth;
double __canvasHeight;

/* 
    Initialize the User Interface Manager
*/
void initUIManager();

/* Public-facing getters */
double getCameraX();
double getCameraY();
double getCameraSpeed();
double getCameraZoom();
double getCanvasWidth();
double getCanvasHeight();

/*
    Turn screen coordinates into real coordinates
*/
double UI_screenXToReal(const double x);
double UI_screenYToReal(const double y);

#endif