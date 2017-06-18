class Comet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Comet';
		this.minRadius = 4;
	}
}

class Asteroid extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Asteroid';
		this.minRadius = 2;
	}
}
