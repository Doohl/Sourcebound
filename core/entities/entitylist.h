#ifndef ENTITYLIST_H
#define ENTITYLIST_H

#include "entity.h"

typedef unsigned int size_t;

/**
	An EntityList is a resizable container of Entity pointers
*/

typedef struct {

    Entity **array;
    size_t used;
    size_t size;

} EntityList;

// Initialize an empty list
void initEntityList(EntityList *entityList, size_t initialSize) {
    entityList->array = (Entity **) malloc(initialSize * sizeof(Entity *));
    entityList->used = 0;
    entityList->size = initialSize;
}

// Append a new entity pointer to the end of the list
void pushList(EntityList *entityList, Entity *entity) {
    if(entityList->used == entityList->size) {
        entityList->size++;
        entityList->array = (Entity **) realloc(entityList->array, entityList->size * sizeof(Entity *));
    }
    entityList->array[entityList->used++] = entity;
}

// Find an entity's position in the list
size_t findList(EntityList *entityList, Entity *entity) {
    size_t index;
    for(index = 0; index < entityList->size; index++) {
        if(entityList->array[index]->id == entity->id) {
            break;
        }
    }
    return index;
}

// Find and remove an entity from the list 
void removeList(EntityList *entityList, Entity *entity) {
    size_t index = findList(entityList, entity);
}

void freeList(EntityList *entityList) {
    free(entityList->array);
    entityList->array = 0;
    entityList->used = entityList->size = 0;
}

#endif