class Planet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Planet';
		this.minRadius = 5;
	}
}

class GasGiant extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Gas Giant';
		this.minRadius = 5;
	}
}

class DwarfPlanet extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Dwarf Planet';
		this.minRadius = 5;
	}
}

class Moon extends Celestial {
	constructor(pProps) {
		super(pProps, '#98A7D6');

		this.eClass = 'Moon';
		this.minRadius = 2;
	}
}
