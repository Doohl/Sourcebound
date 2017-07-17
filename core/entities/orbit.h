#ifndef ORBIT_H
#define ORBIT_H

typedef struct Entity Entity;

/**
	Defines a two-body, 2D kepler orbit
*/
typedef struct Orbit {

    /* Eccentricity (e): description of elliptical eccentricity [0, 1] */
    double eccentricity;

    /* Semimajor Axis (a): sum of the periapsis and apoapsis divided by two */
    double semimajorAxis;

    /* Semiminor Axis (b): square root of periapsis times apoapsis */
    double semiminorAxis;

    /* Grav Standard: Sum of the standard gravitational parameters between two bodies */
    double standardGravTotal;

    /* Mean Angular Motion (n): function of the angular motion with respect to time */
    double meanAngularMotion;

    /* Orbital period (T): time it takes to perform one orbit, in years */
    double period;

    /* The starting mean anomaly at the J2000 epoch */
    double epochAnomaly;

} Orbit;

/**
	Position an entity along an orbit as a function of time
*/
void processOrbit(Orbit *orbit, Entity *entity, uint64_t time);

#endif