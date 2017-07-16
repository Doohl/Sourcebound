const COLOR_INDEXES = [
	[2.00, '#ff5200'],
	[1.95, '#ff7b00'],
	[1.90, '#ff9523'],
	[1.85, '#ffa94b'],
	[1.80, '#ffb765'],
	[1.75, '#ffc178'],
	[1.70, '#ffc885'],
	[1.65, '#ffcc8f'],
	[1.60, '#ffd096'],
	[1.55, '#ffd29c'],
	[1.50, '#ffd5a1'],
	[1.45, '#ffd6a5'],
	[1.40, '#ffd8a9'],
	[1.35, '#ffdaad'],
	[1.30, '#ffdbb0'],
	[1.25, '#ffddb4'],
	[1.20, '#ffdfb8'],
	[1.15, '#ffe0bb'],
	[1.10, '#ffe2bf'],
	[1.05, '#ffe3c3'],
	[1.00, '#ffe5c6'],
	[0.95, '#ffe6ca'],
	[0.90, '#ffe8ce'],
	[0.85, '#ffe9d2'],
	[0.80, '#ffebd6'],
	[0.75, '#ffeddb'],
	[0.70, '#ffefe0'],
	[0.65, '#fff1e5'],
	[0.60, '#fff3ea'],
	[0.55, '#fff5ef'],
	[0.50, '#fff7f5'],
	[0.45, '#fff9fb'],
	[0.40, '#fef9ff'],
	[0.35, '#f8f6ff'],
	[0.30, '#f3f2ff'],
	[0.25, '#eeefff'],
	[0.20, '#e9ecff'],
	[0.15, '#e4e9ff'],
	[0.10, '#dfe5ff'],
	[0.05, '#dae2ff'],
	[0.00, '#d3ddff'],
	[-0.05, '#ccd8ff'],
	[-0.10, '#c4d2ff'],
	[-0.15, '#bbccff'],
	[-0.20, '#b2c5ff'],
	[-0.25, '#aabfff'],
	[-0.30, '#a3b9ff'],
	[-0.35, '#9eb5ff'],
	[-0.40, '#9bb2ff']
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

// function computeColorBV(bv) {
// 	let r = 0, g = 0, b = 0, t = 0;
// 	if(bv < -0.40) {
// 		bv = -0.40;
// 	}
// 	if(bv > 2.00) {
// 		bv = 2.00;
// 	}
// 	if(bv >= -0.40 && bv < 0.00) {
// 		t = (bv + 0.40) / (0.00 + 0.40);
// 	    r = 0.61 + 0.11 * t + 0.1 * t * t;
// 	    g = 0.70 + 0.07 * t + 0.1 * t * t;
// 	    b = 1.0;
// 	} else if(bv >= 0.00 && bv < 0.40) {
// 		t = (bv - 0.00) / (0.40 - 0.00);
// 		r = 0.83 + (0.17 * t);
// 		g = 0.87 + (0.11 * t);
// 		b = 1.0;
// 	} else if(bv >= 0.40 && bv < 1.60) {
// 		t = (bv - 0.40) / (1.60 - 0.40);
// 		r = 1.0;
// 		g = 0.98 - 0.16 * t;
// 	} else {
// 		t = (bv - 1.60) / (2.00 - 1.60);
// 		r = 1.0;
// 		g = 0.82 - 0.5 * t * t;
// 	}
// 	if(bv >= 0.40 && bv < 1.50) {
// 		t = (bv - 0.40) / (1.50 - 0.40);
//     	b = 1.00 - 0.47 * t + 0.1 * t * t;
// 	} else if(bv >= 1.50 && bv < 1.951) {
// 		t = (bv - 1.50) / (1.94 - 1.50);
//     	b = 0.63 - 0.6 * t * t;
// 	} else {
// 		b = 0.0;
// 	}
// 	b = 1;
// 	console.log(b);
// 	console.log(`rgb(${Math.floor(255 * r)}, ${Math.floor(255 * g)}, ${Math.floor(255 * b)})`);
// 	return `rgb(${Math.floor(255 * r)}, ${Math.floor(255 * g)}, ${Math.floor(255 * b)})`;
// }


class Star extends Celestial {
	constructor(pProps) {
		// Convert radius and mass to stellar-relative values
		pProps.radius = pProps.radius * 695700;
		pProps.mass = pProps.mass * 1.98855e+30;

		// The exact color of this star
		let color = computeColorBV(pProps.colorIndex);

		super(pProps, color);

		// The exact Stellar Classification of this star
		this.stellarClass = pProps.stellarClass;

		// The B-V color index of this star
		this.colorIndex = pProps.colorIndex;

		// Star's average surface temperature
		this.surfaceTemp = pProps.temperature;

		// Star's age in billions of years
		this.age = pProps.age;

		this.eClass = ENTITY.STAR;

		this.minRadius = 6;
	}
}
