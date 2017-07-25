class Comet extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 1);

		this.eClass = ENTITY.COMET;
	}
}

class Asteroid extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 1);

		this.eClass = ENTITY.ASTEROID;
	}
}
