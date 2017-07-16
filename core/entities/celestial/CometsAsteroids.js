class Comet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.COMET;
		this.minRadius = 2.3;
	}
}

class Asteroid extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.ASTEROID;
		this.minRadius = 1;
	}
}
