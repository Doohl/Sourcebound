class Planet extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 5);

		this.eClass = ENTITY.PLANET;
	}
}

class GasGiant extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 5);

		this.eClass = ENTITY.PLANET | ENTITY.GAS;
	}
}

class DwarfPlanet extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 2.5);

		this.eClass = ENTITY.PLANET | ENTITY.DWARF;
	}
}

class Moon extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 2);

		this.eClass = ENTITY.MOON;

		// Moons of < 200km radius are known as 'Dwarf Moons', functionally asteroids
		if(this.radius < 200) {
			this.eClass |= ENTITY.DWARF;
			this.minRadius = 1;
		}
	}
}

class SmallMoon extends Celestial {
	constructor(pProps) {
		super(pProps, 0x98A7D6, 1);

		this.eClass = ENTITY.MOON | ENTITY.DWARF;
	}
}
