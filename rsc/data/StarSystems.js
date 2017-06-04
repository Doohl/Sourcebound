/**
 * Pre-defined, important star systems go here
 */
function SolSystem() {
    let Sol = new Star({
        'name': "Sol",
        'system': 'Sol',
        'radius': 695700,
        'mass': 1.98855e+30
    });

    // Main planets and their moons
    let Mercury = new Planet({
        'name': "Mercury",
        'system': 'Sol',
        'radius': 2439.7,
        'mass': 3.3011e+23,
        'orbit': {
            'focus': Sol,
            'periapsis': 46001200,
            'apoapsis': 69816900,
            'omega': 1.3518700794
        }
    });
    let Venus = new Planet({
        'name': "Venus",
        'system': 'Sol',
        'radius': 6051.8,
        'mass': 4.8675e+24,
        'orbit': {
            'focus': Sol,
            'periapsis': 107477000,
            'apoapsis': 108939000,
            'omega': 2.29568357595
        }
    });

    let Earth = new Planet({
        'name': "Earth",
        'system': 'Sol',
        'radius': 6371,
        'mass': 5.97237e+24,
        'orbit': {
            'focus': Sol,
            'periapsis': 147100000,
            'apoapsis': 152100000,
            'omega': 5.028293
        }
    });
        let Luna = new Moon({
            'name': "Luna",
            'system': 'Sol',
            'radius': 1737,
            'mass': 7.34767309e+22,
            'orbit': {
                'focus': Earth,
                'periapsis': 362600,
                'apoapsis': 405400,
                'omega': 5.5528
            }
        });

    let Mars = new Planet({
        'name': "Mars",
        'system': 'Sol',
        'radius': 3389.5,
        'mass': 6.4171e+23,
        'orbit': {
            'focus': Sol,
            'periapsis': 206700000,
            'apoapsis': 249200000,
            'omega': 5.86501907915
        }
    });
        let Phobos = new Moon({
            'name': "Phobos",
            'system': 'Sol',
            'radius': 11.2667,
            'mass': 1.0659e+16,
            'orbit': {
                'focus': Mars,
                'periapsis': 9234.42,
                'apoapsis': 9517.58,
                'omega': 2.6223
            }
        });
        let Deimos = new Moon({
            'name': "Deimos",
            'system': 'Sol',
            'radius': 6.2,
            'mass': 1.4762e+15,
            'orbit': {
                'focus': Mars,
                'periapsis': 23455.5,
                'apoapsis': 23470.9,
                'omega': 5.07011
            }
        });

    let Jupiter = new GasGiant({
        'name': "Jupiter",
        'system': 'Sol',
        'radius': 69911,
        'mass': 1.8986e+27,
        'orbit': {
            'focus': Sol,
            'periapsis': 740552843,
            'apoapsis': 816044416,
            'omega': -1.4975326
        }
    });
        let Io = new Moon({
            'name': "Io",
            'system': 'Sol',
            'radius': 1818.1,
            'mass': 8.931938e+22,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 420000,
                'apoapsis': 423400,
                'omega': 1.4683
            }
        });
        let Europa = new Moon({
            'name': "Europa",
            'system': 'Sol',
            'radius': 1560.7,
            'mass': 4.799844e+22,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 664862,
                'apoapsis': 676938,
                'omega': 1.5528
            }
        });
        let Ganymede = new Moon({
            'name': "Ganymede",
            'system': 'Sol',
            'radius': 2634.1,
            'mass': 1.4819e+23,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 1069200,
                'apoapsis': 1071600,
                'omega': 3.35831
            }
        });
        let Callisto = new Moon({
            'name': "Callisto",
            'system': 'Sol',
            'radius': 2408.4,
            'mass': 1.075938e+23,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 1869000,
                'apoapsis': 1897000,
                'omega': 0.91879
            }
        });
        let Amalthea = new Moon({
            'name': "Amalthea",
            'system': 'Sol',
            'radius': 83.45,
            'mass': 2.08e+18,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 181150,
                'apoapsis': 182840,
                'omega': 2.7205
            }
        });
        let Himalia = new Moon({
            'name': "Himalia",
            'system': 'Sol',
            'radius': 67,
            'mass': 6.7e+18,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 9782900,
                'apoapsis': 13082000,
                'omega': 5.79441
            }
        });
        let Pasiphae = new Moon({
            'name': "Pasiphae",
            'system': 'Sol',
            'radius': 30,
            'mass': 3e+17,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 16980250,
                'apoapsis': 31209300,
                'omega': 2.97491,
                'clockwise': true
            }
        });
        let Sinope = new Moon({
            'name': "Sinope",
            'system': 'Sol',
            'radius': 19,
            'mass': 7.5e+16,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 18237600,
                'apoapsis': 30191200,
                'omega': 6.04572,
                'clockwise': true
            }
        });
        let Thebe = new Moon({
            'name': "Thebe",
            'system': 'Sol',
            'radius': 49.3,
            'mass': 4.3e+17,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 218000,
                'apoapsis': 226000,
                'omega': 4.08877
            }
        });
        let Adrastea = new Moon({
            'name': "Adrastea",
            'system': 'Sol',
            'radius': 8.2,
            'mass': 2e+15,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 123500,
                'apoapsis': 129000,
                'omega': 5.7255
            }
        });
        let Metis = new Moon({
            'name': "Metis",
            'system': 'Sol',
            'radius': 21.5,
            'mass': 3.6e+16,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 127974,
                'apoapsis': 128026,
                'omega': 5.18672
            }
        });

    let Saturn = new GasGiant({
        'name': "Saturn",
        'system': 'Sol',
        'radius': 58232,
        'mass': 5.6836e+26,
        'orbit': {
            'focus': Sol,
            'periapsis': 1.34997e+9,
            'apoapsis': 1508844124,
            'omega': -0.37146,
        }
    });

    let Uranus = new GasGiant({
        'name': "Uranus",
        'system': 'Sol',
        'radius': 25362,
        'mass': 8.6810e+25,
        'orbit': {
            'focus': Sol,
            'periapsis': 2.74213e+9,
            'apoapsis': 3.00841e+9,
            'omega': 1.688333
        }
    });

    let Neptune = new GasGiant({
        'name': "Neptune",
        'system': 'Sol',
        'radius': 24622,
        'mass': 1.0243e+26,
        'orbit': {
            'focus': Sol,
            'periapsis': 4.45951e+9,
            'apoapsis': 4.5373e+9,
            'omega': -1.514079
        }
    });

    let Pluto = new DwarfPlanet({
        'name': "Pluto",
        'system': 'Sol',
        'radius': 1189.9,
        'mass': 1.303e+22,
        'orbit': {
            'focus': Sol,
            'periapsis': 4.436774e+9,
            'apoapsis': 7.375923e+9,
            'omega': 1.97
        }
    });

    // Comets
    let HalleysComet = new Comet({
        'name': "Halley's Comet",
        'system': 'Sol',
        'radius': 5.5,
        'mass': 2.2e+14,
        'orbit': {
            'focus': Sol,
            'periapsis': 87664352,
            'apoapsis': 5.24789e+9,
            'omega': 1.94307506
        }
    });
}
