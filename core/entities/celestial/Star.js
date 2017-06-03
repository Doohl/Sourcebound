class Star extends Celestial {
	constructor(pCoords, pRadius, pMass) {
		super(pCoords, pRadius, pMass, 'rgb(241, 245, 162)');

		this.eClass = 'Star';
		this.minRadius = 6;
	}
}
