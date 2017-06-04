"use strict";

/*
	Entry point of the application: load everything up when DOM is ready
*/

$(() => {

	renderM.initiate();
	inputM.initiate();

	gameM.viewingSystem = 'Sol';

	SolSystem(); // generate the Sol System

	gameM.paused = true;
	setInterval(() => {
		if(!gameM.paused) {
			gameM.clockForward(1296000 / 66.667);
		}
	}, 15);
});
