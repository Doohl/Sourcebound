class Planet extends Celestial {
	constructor(pCoords, pRadius, pMass) {
		super(pCoords, pRadius, pMass, '#98A7D6');

		this.eClass = 'Planet';
        this.minRadius = 5;
	}
}

class DwarfPlanet extends Celestial {
	constructor(pCoords, pRadius, pMass) {
		super(pCoords, pRadius, pMass, '#98A7D6');

		this.eClass = 'Dwarf Planet';
        this.minRadius = 5;
	}
}

class Moon extends Celestial {
	constructor(pCoords, pRadius, pMass) {
		super(pCoords, pRadius, pMass, '#98A7D6');

		this.eClass = 'Moon';
        this.minRadius = 2;
	}
}
