class Comet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Comet';
		this.minRadius = 2.3;
	}
}

class Asteroid extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Asteroid';
		this.minRadius = 1;
	}
}
