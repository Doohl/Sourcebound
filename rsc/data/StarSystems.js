const PARSEC_3D = 7.1404247561181866209600499495178;

// Estimate a star's temperature in [Kelvin] given a B-V color index
function estimateTemperature(bv) {
    return 4600 * ((1/(0.92*bv + 1.7)) + (1/(0.92*bv + 0.62)));
}


/*
    List of real star systems near Sol
        - Distances are to be multiplied by the PARSEC_3D constant to convert to lightyears.
         This is done to preserve real distances in a 2D representation of the neighboring stars.

    Stars have the following properties:
        - stellarClass          : exact Stellar Classification of this star
        - colorIndex            : the B-V color index
        - absoluteMagnitude     : the star's absolute magnitude
        - mass                  : star's mass in solar masses
        - radius                : star's radius in solar radii
        - temperature           : star's temperature in [K]
        - luminosity            : star's luminosity in solar luminosity
        - age                   : star's age in [Gy] (billion years)
        - x/y                   : distances from Sol in a unitless metric (most closely a parsec) to be converted to lightyears
                                    (conversion: x/y * 7.1404247561181866209600499495178 = lightyears)
        - binary                : if defined, sets this star as an orbital of an existing star

    * If any values are left 'undefined' the system will attempt to generate / extrapolate values that best fit the
    supplied properties.
*/
const INTERSTELLAR_MAP = {
    // Sol System
    'Sol': {
        'stellarClass'          : 'G2V',
        'colorIndex'            : 0.656,
        'absoluteMagnitude'     : 4.85,
        'mass'                  : 1,
        'radius'                : 1,
        'temperature'           : 5778,
        'luminosity'            : 1,
        'age'                   : 4.6,
        'x'                     : 0,
        'y'                     : 0
    },

    // Hermes System
    'Hermes': {
        'designation'           : 'HD 75289',
        'stellarClass'          : 'G0V',
        'constellation'         : 'Vela',
        'colorIndex'            : 0.58,
        'absoluteMagnitude'     : 4.05,
        'mass'                  : 1.05,
        'radius'                : 1.25,
        'temperature'           : 6011,
        'luminosity'            : 1.82,
        'age'                   : 4.96,
        'x'                     : -14.42912,
        'y'                     : -16.07115
    },

    'Proxima Centauri': {
        'stellarClass'          : 'M6Ve',
        'colorIndex'            : 1.82,
        'absoluteMagnitude'     : 15.60,
        'mass'                  : 0.123,
        'radius'                : 0.141,
        'temperature'           : 3042,
        'luminosity'            : 0.0017,
        'age'                   : 4.85,
        'x'                     : -0.47175,
        'y'                     : 0.36132
    },
    'Alpha Centauri-A': {
        'stellarClass'          : 'G2V',
        'colorIndex'            : 0.71,
        'absoluteMagnitude'     : 4.38,
        'mass'                  : 1.100,
        'radius'                : 1.227,
        'luminosity'            : 1.519,
        'temperature'           : 5790,
        'age'                   : 4.4,
        'x'                     : -0.50362,
        'y'                     : 0.42139,
    },
    'Alpha Centauri-B': {
        'stellarClass'          : 'K1V',
        'colorIndex'            : 0.88,
        'absoluteMagnitude'     : 5.71,
        'mass'                  : 0.907,
        'radius'                : 0.865,
        'luminosity'            : 0.5002,
        'temperature'           : 5260,
        'age'                   : 6.5,
        'x'                     : -0.50359,
        'y'                     : 0.42128,
        'binary': {
            'primary'           : 'Alpha Centauri-A',
            'system'            : 'Alpha Centauri',
            'periapsis'         : 1803054000,
            'apoapsis'          : 5676946000,
            'omega'             : 4.04305521,
            'epoch'             : 5.917e+10
        }
    },
    "Barnard's Star": {
        'stellarClass'          : 'M4.0V',
        'colorIndex'            : 1.713,
        'absoluteMagnitude'     : 13.21,
        'mass'                  : 0.144,
        'radius'                : 0.865,
        'luminosity'            : 0.0035,
        'temperature'           : 3134,
        'age'                   : 10,
        'x'                     : -0.01729,
        'y'                     : 1.81533
    },
    'Wolf 359': {
        'stellarClass'          : 'M6.5Ve',
        'colorIndex'            : 2.034,
        'absoluteMagnitude'     : 16.65,
        'mass'                  : 0.09,
        'radius'                : 0.16,
        'luminosity'            : 0.0014,
        'temperature'           : 2800,
        'age'                   : 0.250,
        'x'                     : -2.28262,
        'y'                     : -0.64697
    },
    'Lalande 21185': {
        'stellarClass'          : 'M2V',
        'colorIndex'            : 1.444,
        'absoluteMagnitude'     : 10.48,
        'mass'                  : 0.46,
        'radius'                : 0.393,
        'luminosity'            : 0.021,
        'temperature'           : 3828,
        'age'                   : 8.2,
        'x'                     : -1.9995,
        'y'                     : 0.50462
    },

    'Gliese 65-A': {
        'stellarClass'          : 'M5.5V',
        'colorIndex'            : 1.87,
        'absoluteMagnitude'     : 15.47291438,
        'mass'                  : 0.102,
        'radius'                : 0.14,
        'luminosity'            : 0.00006,
        'temperature'           : 2670,
        'age'                   : 0.844,
        'x'                     : 2.27003,
        'y'                     : -1.04443,
        'binary': {
            'partner'           : 'Gliese 65-B',
            'system'            : 'Gliese 65'
        }
    },
    'Gliese 65-B': {
        'stellarClass'          : 'M6V',
        'colorIndex'            : undefined,
        'absoluteMagnitude'     : 15.60291438,
        'mass'                  : 0.100,
        'radius'                : 0.14,
        'luminosity'            : 0.00004,
        'temperature'           : 2650,
        'age'                   : 0.72,
        'x'                     : 2.27003,
        'y'                     : -1.04443,
        'binary': {
            'partner'           : 'Gliese 65-A',
            'system'            : 'Gliese 65'
        }
    },
    'Sirius C': {
        'stellarClass'          : 'M6V',
        'colorIndex'            : undefined,
        'absoluteMagnitude'     : 15.60291438,
        'mass'                  : 0.100,
        'radius'                : 0.14,
        'luminosity'            : 0.00004,
        'temperature'           : 2650,
        'age'                   : 0.72,
        'x'                     : 2.27003,
        'y'                     : -1.04443,
        'binary': {
            'partner'           : 'Gliese 65-A',
            'system'            : 'Gliese 65'
        }
    },
};


function SolSystem() {
    let Sol = new Star({
        'name': "Sol",
        'system': 'Sol',
        'radius': 1,
        'mass': 1,
        'colorIndex': 0.656,
        'stellarClass': 'G'
    });

    // Main planets and their moons
    let Mercury = new Planet({
        'name': "Mercury",
        'system': 'Sol',
        'radius': 2439.7,
        'mass': 3.3011e+23,
        'tilt': 0.0001745329,
        'orbit': {
            'focus': Sol,
            'periapsis': 46001195.642,
            'apoapsis': 69816877.462,
            'omega': 1.3518700794,
            'epochAnomaly': 3.051
        }
    });
    let Venus = new Planet({
        'name': "Venus",
        'system': 'Sol',
        'radius': 6051.8,
        'mass': 4.8675e+24,
        'tilt': 3.0962141,
        'orbit': {
            'focus': Sol,
            'periapsis': 107477000,
            'apoapsis': 108939000,
            'omega': 2.29568357595,
            'epochAnomaly': 0.8753
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
            'omega': 1.7967674,
            'epochAnomaly': 6.254
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
                'omega': 5.5528,
                'epochAnomaly': 2.215
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
            'omega': 5.86501907915,
            'epochAnomaly': 0.338
        },
        'hydrosphere': [
            {
                'type': 'h2o',
                'local': 'polar',
                'solid': 11         // 11% of surface covered in ice water (mostly localized to polar caps)
            }
        ],
        'atmosphere': 0.00592154,   // atmospheric pressure in atm
        'atmosphereComp': [
            {
                'type': 'co2',
                'percent': 95.9
            },
            {
                'type': 'ar',
                'percent': 1.93
            },
            {
                'type': 'n',
                'percent': 1.89
            },
            {
                'type': 'o2',
                'percent': 0.146
            },
            {
                'type': 'co',
                'percent': 0.0557
            }
        ]
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
            'omega': 0.2575033,
            'epochAnomaly': 0.3474
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
        let Anake = new Moon({
            'name': "Anake",
            'system': 'Sol',
            'radius': 14,
            'mass': 3e+16,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 12567000,
                'apoapsis': 29063500,
                'omega': 1.75613
            }
        });
        let Lysithea = new Moon({
            'name': "Lysithea",
            'system': 'Sol',
            'radius': 14,
            'mass': 3e+16,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 1.04e+7,
                'apoapsis': 1.3034e+7,
                'omega': 0.86369
            }
        });
        let Themisto = new Moon({
            'name': "Themisto",
            'system': 'Sol',
            'radius': 4,
            'mass': 6.89e+14,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 5909000,
                'apoapsis': 8874300,
                'omega': 3.8269
            }
        });
        let Elara = new Moon({
            'name': "Elara",
            'system': 'Sol',
            'radius': 43,
            'mass': 8.7e+17,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 9.189e+6,
                'apoapsis': 1.4293e+7,
                'omega': 2.50614
            }
        });
        let Carpo = new Moon({
            'name': "Carpo",
            'system': 'Sol',
            'radius': 1.5,
            'mass': 4.496e+13,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 9.688e+6,
                'apoapsis': 2.429e+7,
                'omega': 1.5716,
                'clockwise': true
            }
        });
        let Leda = new Moon({
            'name': "Leda",
            'system': 'Sol',
            'radius': 10,
            'mass': 1.1e+16,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 9.338e+6,
                'apoapsis': 1.2992e+7,
                'omega': 4.75339
            }
        });
        let Carme = new Moon({
            'name': "Carme",
            'system': 'Sol',
            'radius': 23,
            'mass': 1.3e+17,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 1.748e+7,
                'apoapsis': 2.9332e+7,
                'omega': 0.49217,
                'clockwise': true
            }
        });
        let Callirrhoe = new Moon({
            'name': "Callirrhoe",
            'system': 'Sol',
            'radius': 4.3,
            'mass': 8.6923e+14,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 1.729e+7,
                'apoapsis': 3.092e+7,
                'omega': 0.5322,
                'clockwise': true
            }
        });
        let Praxidike = new Moon({
            'name': "Praxidike",
            'system': 'Sol',
            'radius': 3.4,
            'mass': 4.3461e+14,
            'orbit': {
                'focus': Jupiter,
                'periapsis': 1.608e+7,
                'apoapsis': 2.5732e+7,
                'omega': 3.4294,
                'clockwise': true
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
            'omega': 1.613242,
            'epochAnomaly': 5.532
        }
    });
        let Pan = new Moon({
            'name': "Pan",
            'system': 'Sol',
            'radius': 14.1,
            'mass': 4.95e+15,
            'orbit': {
                'focus': Saturn,
                'periapsis': 133580,
                'apoapsis': 133580,
                'omega': 2.43156
            }
        });
        let Daphnis = new Moon({
            'name': "Daphnis",
            'system': 'Sol',
            'radius': 3.8,
            'mass': 7.7e+13,
            'orbit': {
                'focus': Saturn,
                'periapsis': 136505.5,
                'apoapsis': 136506,
                'omega': 0
            }
        });
        let Atlas = new Moon({
            'name': "Atlas",
            'system': 'Sol',
            'radius': 15.1,
            'mass': 6.6e+15,
            'orbit': {
                'focus': Saturn,
                'periapsis': 137500,
                'apoapsis': 137840,
                'omega': 5.78613
            }
        });
        let Prometheus = new Moon({
            'name': "Prometheus",
            'system': 'Sol',
            'radius': 43.1,
            'mass': 1.595e+17,
            'orbit': {
                'focus': Saturn,
                'periapsis': 139070,
                'apoapsis': 139690,
                'omega': 2.86913
            }
        });
        let Pandora = new Moon({
            'name': "Pandora",
            'system': 'Sol',
            'radius': 40.7,
            'mass': 1.371e+17,
            'orbit': {
                'focus': Saturn,
                'periapsis': 141120,
                'apoapsis': 142320,
                'omega': 1.4567
            }
        });
        let Epimetheus = new Moon({
            'name': "Epimetheus",
            'system': 'Sol',
            'radius': 58.1,
            'mass': 5.266e+17,
            'orbit': {
                'focus': Saturn,
                'periapsis': 149900,
                'apoapsis': 152900,
                'omega': 5.45642
            }
        });
        let Janus = new Moon({
            'name': "Janus",
            'system': 'Sol',
            'radius': 89.5,
            'mass': 3.7493e+19,
            'orbit': {
                'focus': Saturn,
                'periapsis': 150400,
                'apoapsis': 152500,
                'omega': 4.21982
            }
        });
        let Mimas = new Moon({
            'name': "Mimas",
            'system': 'Sol',
            'radius': 198.2,
            'mass': 3.7493e+19,
            'orbit': {
                'focus': Saturn,
                'periapsis': 181902,
                'apoapsis': 189176,
                'omega': 0.25049
            }
        });
        let Enceladus = new Moon({
            'name': "Enceladus",
            'system': 'Sol',
            'radius': 252.1,
            'mass': 1.08022e+20,
            'orbit': {
                'focus': Saturn,
                'periapsis': 236900,
                'apoapsis': 239200,
                'omega': 3.69875
            }
        });
        let Tethys = new Moon({
            'name': "Tethys",
            'system': 'Sol',
            'radius': 531.1,
            'mass': 6.17449e+20,
            'orbit': {
                'focus': Saturn,
                'periapsis': 294640,
                'apoapsis': 294700,
                'omega': 4.58751
            }
        });
        let Telesto = new Moon({
            'name': "Telesto",
            'system': 'Sol',
            'radius': 12.4,
            'mass': 1.13898e+16,
            'orbit': {
                'focus': Saturn,
                'periapsis': 294650,
                'apoapsis': 294770,
                'omega': 5.96545
            }
        });
        let Dione = new Moon({
            'name': "Dione",
            'system': 'Sol',
            'radius': 561.4,
            'mass': 1.095452e+21,
            'orbit': {
                'focus': Saturn,
                'periapsis': 376590,
                'apoapsis': 378250,
                'omega': 2.94646
            }
        });
        let Rhea = new Moon({
            'name': "Rhea",
            'system': 'Sol',
            'radius': 763.8,
            'mass': 2.306518e+21,
            'orbit': {
                'focus': Saturn,
                'periapsis': 526540,
                'apoapsis': 527600,
                'omega': 4.47867
            }
        });
        let Titan = new Moon({
            'name': "Titan",
            'system': 'Sol',
            'radius': 2575.5,
            'mass': 1.3452e+23,
            'orbit': {
                'focus': Saturn,
                'periapsis': 1186680,
                'apoapsis': 1257060,
                'omega': 3.24057
            }
        });
        let Hyperion = new Moon({
            'name': "Hyperion",
            'system': 'Sol',
            'radius': 135,
            'mass': 5.6199e+18,
            'orbit': {
                'focus': Saturn,
                'periapsis': 1.4598e+6,
                'apoapsis': 1.542e+6,
                'omega': 5.65806
            }
        });
        let Iapetus = new Moon({
            'name': "Iapetus",
            'system': 'Sol',
            'radius': 734.5,
            'mass': 1.805635e+21,
            'orbit': {
                'focus': Saturn,
                'periapsis': 3.46e+6,
                'apoapsis': 3.662e+6,
                'omega': 4.81573
            }
        });
        let Kiviuq = new Moon({
            'name': "Kiviuq",
            'system': 'Sol',
            'radius': 8,
            'mass': 3297070552813820,
            'orbit': {
                'focus': Saturn,
                'periapsis': 7.458e+6,
                'apoapsis': 1.476e+7,
                'omega': 1.4363
            }
        });
        let Ijiraq = new Moon({
            'name': "Ijiraq",
            'system': 'Sol',
            'radius': 6,
            'mass': 1198934746477750,
            'orbit': {
                'focus': Saturn,
                'periapsis': 7.605e+6,
                'apoapsis': 1.464e+7,
                'omega': 1.4938
            }
        });
        let Phoebe = new Moon({
            'name': "Phoebe",
            'system': 'Sol',
            'radius': 106.5,
            'mass': 8.292e+18,
            'orbit': {
                'focus': Saturn,
                'periapsis': 1.0831e+7,
                'apoapsis': 1.5065e+7,
                'omega': 6.03154,
                'clockwise': true
            }
        });
        let Paaliaq = new Moon({
            'name': "Paaliaq",
            'system': 'Sol',
            'radius': 11,
            'mass': 8.24267e+15,
            'orbit': {
                'focus': Saturn,
                'periapsis': 9.7e+6,
                'apoapsis': 2.07e+7,
                'omega': 4.16898
            }
        });
        let Skathi = new Moon({
            'name': "Skathi",
            'system': 'Sol',
            'radius': 4,
            'mass': 3.147203e+14,
            'orbit': {
                'focus': Saturn,
                'periapsis': 1.134e+7,
                'apoapsis': 1.9739e+7,
                'omega': 3.52242,
                'clockwise': true
            }
        });
        let Albiorix = new Moon({
            'name': "Albiorix",
            'system': 'Sol',
            'radius': 16,
            'mass': 2.09813e+16,
            'orbit': {
                'focus': Saturn,
                'periapsis': 8.463e+6,
                'apoapsis': 2.39e+7,
                'omega': 0.967
            }
        });
        let Bebhionn = new Moon({
            'name': "Bebhionn",
            'system': 'Sol',
            'radius': 3,
            'mass': 4.1232e+12,
            'orbit': {
                'focus': Saturn,
                'periapsis': 8.463e+6,
                'apoapsis': 2.515e+7,
                'omega': 0.1062
            }
        });
        let Erriapus = new Moon({
            'name': "Erriapus",
            'system': 'Sol',
            'radius': 5,
            'mass': 7.643209e+14,
            'orbit': {
                'focus': Saturn,
                'periapsis': 8.463e+6,
                'apoapsis': 2.515e+7,
                'omega': -0.8062
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
            'omega': 2.9838889,
            'epochAnomaly': 2.462
        }
    });
        let Cordelia = new Moon({
            'name': "Cordelia",
            'system': 'Sol',
            'radius': 20,
            'mass': 0.044e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 49757,
                'apoapsis': 49783,
                'omega': 2.38808
            }
        });
        let Ophelia = new Moon({
            'name': "Ophelia",
            'system': 'Sol',
            'radius': 21.5,
            'mass': 0.053e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 53256,
                'apoapsis': 54324,
                'omega': 0.30999
            }
        });
        let Bianca = new Moon({
            'name': "Bianca",
            'system': 'Sol',
            'radius': 25.7,
            'mass': 0.092e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 59115,
                'apoapsis': 59224,
                'omega': 0.1447
            }
        });
        let Cressida = new Moon({
            'name': "Cressida",
            'system': 'Sol',
            'radius': 40,
            'mass': 0.34e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 61757,
                'apoapsis': 61802,
                'omega': 0.77206
            }
        });
        let Desdemona = new Moon({
            'name': "Desdemona",
            'system': 'Sol',
            'radius': 32,
            'mass': 0.18e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 62671,
                'apoapsis': 62688,
                'omega': 3.19893
            }
        });
        let Juliet = new Moon({
            'name': "Juliet",
            'system': 'Sol',
            'radius': 47,
            'mass': 0.56e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 64307,
                'apoapsis': 64392,
                'omega': 3.90638
            }
        });
        let Portia = new Moon({
            'name': "Portia",
            'system': 'Sol',
            'radius': 67.5,
            'mass': 1.70e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 66086,
                'apoapsis': 66093,
                'omega': 3.88219
            }
        });
        let Rosalind = new Moon({
            'name': "Rosalind",
            'system': 'Sol',
            'radius': 36,
            'mass': 0.25e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 69932,
                'apoapsis': 69947,
                'omega': 2.45179
            }
        });
        let Belinda = new Moon({
            'name': "Belinda",
            'system': 'Sol',
            'radius': 45,
            'mass': 0.49e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 75254,
                'apoapsis': 75265,
                'omega': 0.74012
            }
        });
        let Puck = new Moon({
            'name': "Puck",
            'system': 'Sol',
            'radius': 81,
            'mass': 2.90e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 85999,
                'apoapsis': 86020,
                'omega': 3.09087
            }
        });
        let Miranda = new Moon({
            'name': "Miranda",
            'system': 'Sol',
            'radius': 235.8,
            'mass': 65.9e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 129221,
                'apoapsis': 129558,
                'omega': 1.1923
            }
        });
        let Ariel = new Moon({
            'name': "Ariel",
            'system': 'Sol',
            'radius': 578.9,
            'mass': 1.353e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 190700,
                'apoapsis': 191100,
                'omega': 2.01322
            }
        });
        let Umbriel = new Moon({
            'name': "Umbriel",
            'system': 'Sol',
            'radius': 578.9,
            'mass': 1.172e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 265000,
                'apoapsis': 267000,
                'omega': 1.4785
            }
        });
        let Titania = new Moon({
            'name': "Titania",
            'system': 'Sol',
            'radius': 788.4,
            'mass': 3.527e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 435430.49,
                'apoapsis': 436389.50,
                'omega': 4.964
            }
        });
        let Oberon = new Moon({
            'name': "Oberon",
            'system': 'Sol',
            'radius': 761.4,
            'mass': 3014e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 582703,
                'apoapsis': 584336,
                'omega': 1.822
            }
        });
        let Francisco = new Moon({
            'name': "Francisco",
            'system': 'Sol',
            'radius': 11,
            'mass': 0.0072e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 3652131,
                'apoapsis': 4899868,
                'omega': 2.1768,
                'clockwise': true
            }
        });
        let Caliban = new Moon({
            'name': "Caliban",
            'system': 'Sol',
            'radius': 36,
            'mass': 0.25e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 6082599,
                'apoapsis': 8377401,
                'omega': 5.98329,
                'clockwise': true
            }
        });
        let Margaret = new Moon({
            'name': "Margaret",
            'system': 'Sol',
            'radius': 10,
            'mass': 0.0054e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 4865824,
                'apoapsis': 23824176,
                'omega': 1.56
            }
        });
        let Prospero = new Moon({
            'name': "Prospero",
            'system': 'Sol',
            'radius': 25,
            'mass': 0.085e+18,
            'orbit': {
                'focus': Uranus,
                'periapsis': 9115273,
                'apoapsis': 23720726,
                'omega': 4.333,
                'clockwise': true
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
            'omega': 0.7848981,
            'epochAnomaly': 4.471
        }
    });
        let Naiad = new Moon({
            'name': "Naiad",
            'system': 'Sol',
            'radius': 33,
            'mass': 19e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 48212,
                'apoapsis': 48241,
                'omega': 0.55385
            }
        });
        let Thalassa = new Moon({
            'name': "Thalassa",
            'system': 'Sol',
            'radius': 41,
            'mass': 35e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 50063,
                'apoapsis': 50084,
                'omega': 5.6396
            }
        });
        let Despina = new Moon({
            'name': "Despina",
            'system': 'Sol',
            'radius': 75,
            'mass': 210e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 52515,
                'apoapsis': 52536,
                'omega': 5.12019
            }
        });
        let Galatea = new Moon({
            'name': "Galatea",
            'system': 'Sol',
            'radius': 88,
            'mass': 375e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 61946,
                'apoapsis': 61959,
                'omega': 0.47941
            }
        });
        let s2004 = new Moon({
            'name': "S/2004 N 1",
            'system': 'Sol',
            'radius': 9,
            'mass': 0.5e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 105300,
                'apoapsis': 105300,
                'omega': 0
            }
        });
        let Proteus = new Moon({
            'name': "Proteus",
            'system': 'Sol',
            'radius': 210,
            'mass': 5035e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 117587,
                'apoapsis': 117704,
                'omega': 5.26576
            }
        });
        let Triton = new Moon({
            'name': "Triton",
            'system': 'Sol',
            'radius': 1353.4,
            'mass': 2.14e+22,
            'orbit': {
                'focus': Neptune,
                'periapsis': 354753,
                'apoapsis': 354764,
                'omega': 6.00474,
                'clockwise': true
            }
        });
        let Nereid = new Moon({
            'name': "Nereid",
            'system': 'Sol',
            'radius': 170,
            'mass': 2700e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 1374594,
                'apoapsis': 9653041,
                'omega': 4.90141
            }
        });
        let Halimede = new Moon({
            'name': "Halimede",
            'system': 'Sol',
            'radius': 31,
            'mass': 16e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 12215729,
                'apoapsis': 21006270,
                'omega': 2.7878,
                'clockwise': true
            }
        });
        let Sao = new Moon({
            'name': "Sao",
            'system': 'Sol',
            'radius': 22,
            'mass': 6e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 19193878,
                'apoapsis': 25262122,
                'omega': 1.3846
            }
        });
        let Laomedeia = new Moon({
            'name': "Laomedeia",
            'system': 'Sol',
            'radius': 21,
            'mass': 5e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 14213257,
                'apoapsis': 32920742,
                'omega': 2.48526
            }
        });
        let Psamathe = new Moon({
            'name': "Psamathe",
            'system': 'Sol',
            'radius': 20,
            'mass': 4e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 29776233,
                'apoapsis': 66415766,
                'omega': 2.54652,
                'clockwise': true
            }
        });
        let Neso = new Moon({
            'name': "Neso",
            'system': 'Sol',
            'radius': 30,
            'mass': 15e+16,
            'orbit': {
                'focus': Neptune,
                'periapsis': 21123551,
                'apoapsis': 77446449 ,
                'omega': -0.5622,
                'clockwise': true
            }
        });

    // Dwarf Planets
    let Ceres = new DwarfPlanet({
        'name': "Ceres",
        'system': 'Sol',
        'radius': 473,
        'mass': 9.393e+20,
        'orbit': {
            'focus': Sol,
            'periapsis': 382620000,
            'apoapsis': 414010000,
            'omega': 1.276721,
            'epochAnomaly': 0.1194
        }
    });

    let Haumea = new DwarfPlanet({
        'name': "Haumea",
        'system': 'Sol',
        'radius': 620,
        'mass': 4.006e+21,
        'orbit': {
            'focus': Sol,
            'periapsis': 5.228745e+9,
            'apoapsis': 7.701747e+9,
            'omega': 4.1826,
            'epochAnomaly': 3.331
        }
    });
        let Hiiaka = new Moon({
            'name': "Hi'iaka",
            'system': 'Sol',
            'radius': 310,
            'mass': 0.0179e+21,
            'orbit': {
                'focus': Haumea,
                'periapsis': 47321.15,
                'apoapsis': 52438.84,
                'omega': -0.4883
            }
        });
        let Namaka = new Moon({
            'name': "Namaka",
            'system': 'Sol',
            'radius': 170,
            'mass': 0.00179e+21,
            'orbit': {
                'focus': Haumea,
                'periapsis': 19268.407,
                'apoapsis': 32045.59,
                'omega': 3.122394
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
            'omega': 3.89,
            'epochAnomaly': 0.2617
        }
    });
        let Charon = new Moon({
            'name': "Charon",
            'system': 'Sol',
            'radius': 606,
            'mass': 1.586e+21,
            'orbit': {
                'focus': Pluto,
                'periapsis': 19571,
                'apoapsis': 19571,
                'omega': 0
            }
        });
        let Nix = new Moon({
            'name': "Nix",
            'system': 'Sol',
            'radius': 23,
            'mass': 4.5e+16,
            'orbit': {
                'focus': Pluto,
                'periapsis': 48694,
                'apoapsis': 48694,
                'omega': 0
            }
        });
        let Hydra = new Moon({
            'name': "Hydra",
            'system': 'Sol',
            'radius': 30.5,
            'mass': 4.8e+16,
            'orbit': {
                'focus': Pluto,
                'periapsis': 64440,
                'apoapsis': 65120,
                'omega': -0.4
            }
        });
        let Kerberos = new Moon({
            'name': "Kerberos",
            'system': 'Sol',
            'radius': 14.0,
            'mass': 1.65e+16,
            'orbit': {
                'focus': Pluto,
                'periapsis': 59000,
                'apoapsis': 59000,
                'omega': -0.55
            }
        });
        let Styx = new Moon({
            'name': "Styx",
            'system': 'Sol',
            'radius': 10.0,
            'mass': 7.5e+15,
            'orbit': {
                'focus': Pluto,
                'periapsis': 46670,
                'apoapsis': 46670,
                'omega': 0.2
            }
        });

    let Makemake = new DwarfPlanet({
        'name': "Makemake",
        'system': 'Sol',
        'radius': 715,
        'mass': 4.4e+21,
        'orbit': {
            'focus': Sol,
            'periapsis': 5.77298e+9,
            'apoapsis': 7.90475e+9,
            'omega': 5.1818,
            'epochAnomaly': 2.433
        }
    });

    let Eris = new DwarfPlanet({
        'name': "Eris",
        'system': 'Sol',
        'radius': 1163,
        'mass': 1.66e+22,
        'orbit': {
            'focus': Sol,
            'periapsis': 5.723e+9,
            'apoapsis': 14.602e+9,
            'omega': 2.6389,
            'epochAnomaly': 3.389
        }
    });
        let Dysnomia = new Moon({
            'name': "Dysnomia",
            'system': 'Sol',
            'radius': 257,
            'mass': 4.26022e+21,
            'orbit': {
                'focus': Eris,
                'periapsis': 36860,
                'apoapsis': 37840,
                'omega': 3.1107
            }
        });

    // Comets
    let HalleysComet = new Comet({
        'name': "Comet: Halley",
        'system': 'Sol',
        'radius': 5.5,
        'mass': 2.2e+14,
        'orbit': {
            'focus': Sol,
            'periapsis': 87664352,
            'apoapsis': 5.24789e+9,
            'omega': 1.94307506,
            'epochAnomaly': 2.981
        }
    });
    let Arrest6P = new Comet({
        'name': "Comet: d'Arrest",
        'system': 'Sol',
        'radius': 12,
        'mass': 4.97e+14,
        'orbit': {
            'focus': Sol,
            'periapsis': 2.02406e+8,
            'apoapsis': 8.43283e+8,
            'omega': -0.0024,
            'epochAnomaly': 3.51098897
        }
    });

    // Asteroids
    let Asteroids = [
        {
            'name': "2 Pallas",
            'radius': 256,
            'mass': 2.11e+20,
            'orbit': {
                'periapsis': 318734227,
                'apoapsis': 510518517,
                'omega': 5.40930467
            }
        },
        {
            'name': "3 Juno",
            'radius': 116,
            'mass': 2.67e+19,
            'orbit': {
                'periapsis': 297470878,
                'apoapsis': 501591188,
                'omega': 4.33557239
            }
        },
        {
            'name': "4 Vesta",
            'radius': 262,
            'mass': 2.59076e+20,
            'orbit': {
                'periapsis': 2.15221 * Util.AU,
                'apoapsis': 2.57138 * Util.AU,
                'omega': 151.19853 * Util.DEG
            }
        },
        {
            'name': "5 Astraea",
            'radius': 59,
            'mass': 2.9e+18,
            'orbit': {
                'periapsis': 2.08186277 * Util.AU,
                'apoapsis': 3.065755252 * Util.AU,
                'omega': 358.92898 * Util.DEG
            }
        },
        {
            'name': "6 Hebe",
            'radius': 102,
            'mass': 1.28e+18,
            'orbit': {
                'periapsis': 1.937 * Util.AU,
                'apoapsis': 2.914 * Util.AU,
                'omega': 239.492 * Util.DEG
            }
        },
        {
            'name': "7 Iris",
            'radius': 100,
            'mass': 1.62e+18,
            'orbit': {
                'periapsis': 1.833 * Util.AU,
                'apoapsis': 2.937 * Util.AU,
                'omega': 145.440 * Util.DEG
            }
        },
        {
            'name': "8 Flora",
            'radius': 72,
            'mass': 8.47e+18,
            'orbit': {
                'periapsis': 1.858 * Util.AU,
                'apoapsis': 2.546 * Util.AU,
                'omega': 285.128 * Util.DEG
            }
        },
        {
            'name': "9 Metis",
            'radius': 95,
            'mass': 1.47e+19,
            'orbit': {
                'periapsis': 1.858 * Util.AU,
                'apoapsis': 2.096 * Util.AU,
                'omega': 5.489 * Util.DEG
            }
        },
        {
            'name': "10 Hygiea",
            'radius': 215,
            'mass': 8.67e+19,
            'orbit': {
                'periapsis': 2.7817 * Util.AU,
                'apoapsis': 3.5024 * Util.AU,
                'omega': 312.10 * Util.DEG
            }
        },
    ];

    for(let asteroid of Asteroids) {
        asteroid.system = 'Sol';
        asteroid.orbit.focus = Sol;
        new Asteroid(asteroid);
    }
}
