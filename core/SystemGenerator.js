const VOID_STAR_ROLL = 1;           // roll a 2d12 -> if 2, is a 'void star' (0.69%)


function GenerateStar(name, stellarClass) {
}

/**
    Generate a random star system
        - if [forceLife] defined: generate a celestial that perfectly supports life for this species
*/
function GenerateSystem(pStar, pForceLife) {
    if(Util.roll('2d12') == VOID_STAR_ROLL) {
        return;
    }

    const mainPlanets       = Util.roll('2d7') - 2;         // Number of main planets in the system
    const dwarfPlanets      = Util.roll('1d12') - 1;        // Number of dwarf planets in the system
    const comets            = Util.roll('2d15') - 1;         // Number of comets in the system
    const asteroids         = Util.roll('3d25');            // Number of asteroids in the system

    // Generate main planets first
    for(let i = 0; i < mainPlanets; i++) {

    }
}

/** 
 * Generate a star system from a JSON file. 
 * Returns a promise that resolves the root Celestial of the star system
 * @param {URL} file
 *      The json file to read
 * @return {Promise.<Celestial>}
 *      A promise that resolves the root Celestial
 */
function ReadSystem(file) {
    return new Promise((resolve, reject) => {
		fetch(file).then(response => {
            return response.json();
        }).then(systemJSON => {
            let celestial = loadCelestialData(systemJSON);
            resolve(celestial);
        });
	});
}