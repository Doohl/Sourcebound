"use strict";

/*
	Entry point of the application: load everything up when DOM is ready
*/

/*
$(() => {

	GameM.clockSet(1.0092e+11);

	RenderM.initiate();
	InputM.initiate();
	UI.initiate();

	GameM.viewingSystem = 'Sol';

	SolSystem(); // generate the Sol System
	GenerateSystem('test'); // generate a random system

	GameM.paused = true;
	GameM.increment = Util.EARTH_DAY * 160;

	setInterval(() => {
		if(!GameM.paused) {
			GameM.clockForward(GameM.increment / 66.666666666666666666666666666667);
		}
	}, 15);
});
*/

var calledMain = false;

function main() {
	calledMain = true;
	
	RenderM.onDOMReady();
	InputM.onDOMReady();
	UIM.onDOMReady();

	LogicM.setViewingSystem('Sol');


	/* Load all of the default system json files */
	let defaultSystems = [
		'./rsc/data/Sol.json'
	];
	let promises = defaultSystems.map(url => {
		return ReadSystem(url);
	});

	/* Once all the files are loaded, begin the game */
	Promise.all(promises).then(() => {
		LogicM.paused = true;
		LogicM.increment = Util.EARTH_DAY * 2;

		setInterval(() => {
			if(!LogicM.paused) {
				LogicM.clockForward(LogicM.increment / 66.666666666666666666666666666667);
			}
		}, 15);

		LogicM.clockForward(1);
	});
}

/* Trigger main() when the DOM has fully loaded */
document.onreadystatechange = function() {
	if(document.readyState === 'complete' && !calledMain) {
		main();
	}
}
