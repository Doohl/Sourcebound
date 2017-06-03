"use strict";

/*
	Entry point of the application: load everything up when DOM is ready
*/

$(() => {

	renderM.initiate();
	inputM.initiate();

	// Testing stuff
	let Sol = new Star([0, 0, 'test'], 695700, 1.98855e+30);
	Sol.name = "Sol";

	let Mercury = new Planet([46001200, 0, 'test'], 2439.7, 3.3011e+23);
	Mercury.name = "Mercury";
	Mercury.makeOrbital(Sol, 46001200, 69816900, true);

	let Mars = new Planet([206700000, 0, 'test'], 3389.5, 6.4171e+23);
	Mars.name = "Mars";
	Mars.makeOrbital(Sol, 206700000, 249200000, true);
	let Phobos = new Moon([206700000 + 9234.42, 0, 'test'], 11.2667, 1.0659e+16)
	Phobos.name = "Phobos";
	Phobos.makeOrbital(Mars, 9234.42, 9517.58, true);
	let Deimos = new Moon([206700000 + 23455.5, 0, 'test'], 6.2, 1.4762e+15)
	Deimos.name = "Deimos";
	Deimos.makeOrbital(Mars, 23455.5, 23470.9, true);


	let Venus = new Planet([107477000, 0, 'test'], 6051.8, 4.8675e+24);
	Venus.name = "Venus";
	Venus.makeOrbital(Sol, 107477000, 108939000, true);

	let Earth = new Planet([147100000, 0, "test"], 6371, 5.97237e+24);
	Earth.makeOrbital(Sol, 147100000, 152100000, true);
	Earth.name = "Earth";
	let Luna = new Moon([147100000 + 362600, 0, "test"], 1737, 7.34767309e+22);
	Luna.name = "Luna";
	Luna.makeOrbital(Earth, 362600, 405400, true);

	gameM.paused = true;
	setInterval(() => {
		if(!gameM.paused) {
			gameM.clockForward(1 / 66.667);
		}
	}, 15);
});
