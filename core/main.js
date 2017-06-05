"use strict";

/*
	Entry point of the application: load everything up when DOM is ready
*/

$(() => {

	RenderM.initiate();
	InputM.initiate();

	GameM.viewingSystem = 'Sol';

	SolSystem(); // generate the Sol System

	GameM.paused = false;
	GameM.increment = 86400;
	setInterval(() => {
		if(!GameM.paused) {
			GameM.clockForward(GameM.increment / 66.667);
		}
	}, 15);
});
