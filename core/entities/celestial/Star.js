const COLOR_INDEXES = [
	[2.00, 0xff5200],
	[1.95, 0xff7b00],
	[1.90, 0xff9523],
	[1.85, 0xffa94b],
	[1.80, 0xffb765],
	[1.75, 0xffc178],
	[1.70, 0xffc885],
	[1.65, 0xffcc8f],
	[1.60, 0xffd096],
	[1.55, 0xffd29c],
	[1.50, 0xffd5a1],
	[1.45, 0xffd6a5],
	[1.40, 0xffd8a9],
	[1.35, 0xffdaad],
	[1.30, 0xffdbb0],
	[1.25, 0xffddb4],
	[1.20, 0xffdfb8],
	[1.15, 0xffe0bb],
	[1.10, 0xffe2bf],
	[1.05, 0xffe3c3],
	[1.00, 0xffe5c6],
	[0.95, 0xffe6ca],
	[0.90, 0xffe8ce],
	[0.85, 0xffe9d2],
	[0.80, 0xffebd6],
	[0.75, 0xffeddb],
	[0.70, 0xffefe0],
	[0.65, 0xfff1e5],
	[0.60, 0xfff3ea],
	[0.55, 0xfff5ef],
	[0.50, 0xfff7f5],
	[0.45, 0xfff9fb],
	[0.40, 0xfef9ff],
	[0.35, 0xf8f6ff],
	[0.30, 0xf3f2ff],
	[0.25, 0xeeefff],
	[0.20, 0xe9ecff],
	[0.15, 0xe4e9ff],
	[0.10, 0xdfe5ff],
	[0.05, 0xdae2ff],
	[0.00, 0xd3ddff],
	[-0.05, 0xccd8ff],
	[-0.10, 0xc4d2ff],
	[-0.15, 0xbbccff],
	[-0.20, 0xb2c5ff],
	[-0.25, 0xaabfff],
	[-0.30, 0xa3b9ff],
	[-0.35, 0x9eb5ff],
	[-0.40, 0x9bb2ff]
]

function computeColorBV(bvIndex) {
	let leastDiff;
	let leastColor;
	for(let entry of COLOR_INDEXES) {
		let diff = Math.abs(entry[0] - bvIndex);
		if(leastDiff === undefined || diff < leastDiff) {
			leastDiff = diff;
			leastColor = entry[1];
		}
	}
	console.log(leastColor);
	return leastColor;
}


class Star extends Celestial {
	constructor(pProps) {
		// Convert radius and mass to stellar-relative values
		pProps.radius = pProps.radius * 695700;
		pProps.mass = pProps.mass * 1.98855e+30;

		// The exact color of this star
		let color = computeColorBV(pProps.colorIndex);

		super(pProps, color, 6);

		// The exact Stellar Classification of this star
		this.stellarClass = pProps.stellarClass;

		// The B-V color index of this star
		this.colorIndex = pProps.colorIndex;

		// Star's average surface temperature
		this.surfaceTemp = pProps.temperature;

		// Star's age in billions of years
		this.age = pProps.age;

		this.eClass = ENTITY.STAR;
	}
}
