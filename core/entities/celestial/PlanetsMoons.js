class Planet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.PLANET;
		this.minRadius = 5;
	}
}

class GasGiant extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.PLANET | ENTITY.GAS;
		this.minRadius = 5;
	}
}

class DwarfPlanet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.PLANET | ENTITY.DWARF;
		this.minRadius = 2.5;
	}
}

class Moon extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.MOON;

		// Moons of < 200km radius are known as 'Dwarf Moons', functionally asteroids
		if(this.radius < 200) {
			this.eClass |= ENTITY.DWARF;
			this.minRadius = 1;
		} else {
			this.eClass = 'Moon';
			this.minRadius = 2;
		}
	}
}

class SmallMoon extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = ENTITY.MOON | ENTITY.DWARF;
		this.minRadius = 1;
	}
}
