#ifndef ENTITY_H
#define ENTITY_H

/*
    Entity type flags (uint32)
*/
typedef enum Type {
    BLANK       = (1 << 0),       // undefined; usually a result of an error

    // Base celestial types
    ASTEROID    = (1 << 1),
    COMET       = (1 << 2),
    PLANET      = (1 << 3),
    MOON        = (1 << 4),
    STAR        = (1 << 5),
    
    // Celestial modifiers
    GAS         = (1 << 6),
    DWARF       = (1 << 7),
    GIANT       = (1 << 8),
    SUPERGIANT  = (1 << 9),
    BLACKHOLE   = (1 << 10)

} Type;


/**
	Entities are renderable objects that contain logic to be processed every time increment.
*/
typedef struct Entity {

    /* A unique ID */
    unsigned int id;

    /* The entity's non-unique name */
    char *name;
    
    /* Type bitfield */
    Type type;

} Entity;

#endif