"use strict";

/*
	Entry point of the application: load everything up when DOM is ready
*/

$(() => {
	GameM.clockSet(4.24317e+11);

	RenderM.initiate();
	InputM.initiate();
	UI.initiate();

	GameM.viewingSystem = 'Sol';

	SolSystem(); // generate the Sol System
	GenerateSystem('test'); // generate a random system

	GameM.paused = true;
	GameM.increment = Util.EARTH_DAY * 15;
	setInterval(() => {
		if(!GameM.paused) {
			GameM.clockForward(GameM.increment / 66.666666666666666666666666666667);
		}
	}, 15);
});
