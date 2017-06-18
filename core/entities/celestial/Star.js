class Star extends Celestial {
	constructor(pProps) {
		super(pProps, 'rgb(241, 245, 162)');

		this.eClass = 'Star';

		// The exact Stellar Classification of this star
		this.stellarClass = pProps.stellarClass;

		// The B-V color index
		this.colorIndex

		this.minRadius = 6;
	}
}
