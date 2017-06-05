"use strict";

/*
	Entry point of the application: load everything up when DOM is ready
*/

$(() => {

	renderM.initiate();
	inputM.initiate();

	gameM.viewingSystem = 'Sol';

	SolSystem(); // generate the Sol System

	gameM.paused = false;
	gameM.increment = 86400;
	setInterval(() => {
		if(!gameM.paused) {
			gameM.clockForward(gameM.increment / 66.667);
		}
	}, 15);
});
