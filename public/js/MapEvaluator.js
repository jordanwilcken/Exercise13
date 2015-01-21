var $M, isNaN;

function MapEvaluator() {
	var map, directionsAreProportional, getPointOfIntersection;

	directionsAreProportional = function (dir1, dir2) {
		var proportion;
		if (dir1.X !== 0) {
			proportion = dir2.X / dir1.X;
		} else if (dir1.Y !== 0) {
			proportion = dir2.Y / dir1.Y;
		} else if (dir1.Z !== 0) {
			proportion = dir2.Z / dir1.Z;
		}
		if (undefined !== proportion) {
			return dir2.equals(dir1.Times(proportion));
		}
		throw new Error("One of the arguments passed to " +
			"directionsAreProportional was the Zero vector.");
	};

	// A function only for lines intersecting at
	// ONLY one point.
	//
	getPointOfIntersection = function (line1, line2) {
		var a, b, c, d, e, f, divisor, s1, s2, t1, t2, matrix, upperTriangular, sameInXAndY;
		sameInXAndY = false;
		/* Solving the equations
		 * x1 + at = x2 + ds and
		 * y1 + bt = y2 + es
		 * for t and s
		 */
		a = line1.direction().X;
		b = line1.direction().Y;
		c = line1.direction().Z;
		d = line2.direction().X;
		e = line2.direction().Y;
		f = line2.direction().Z;
		matrix = $M(
			[
				[ d, -a, line1.Point1.X - line2.Point1.X ],
				[ e, -b, line1.Point1.Y - line2.Point1.Y ]
			]
		);
		upperTriangular = matrix.toUpperTriangular();
		if (upperTriangular.e(2, 2) === 0) {
			if (upperTriangular.e(2, 3) !== 0) {
				return undefined;
			}
			sameInXAndY = true;
		}
		if (!sameInXAndY) {
			t1 = upperTriangular.e(2, 3) / upperTriangular.e(2, 2);
			if (t1 < 0 || t1 > 1) { return undefined; }
			s1 = (upperTriangular.e(1, 3) / upperTriangular.e(1, 1)) -
					(upperTriangular.e(1, 2) * s1 / upperTriangular.e(1, 1));
			if (isNaN(s1) || s1 < 0 || s1 > 1) { return undefined; }
		}
		/* Now solving the equations
		 * y1 + bt = y2 + es
		 * z1 + ct = z2 + fs
		 * for t and s
		 */
		matrix = $M(
			[
				[ e, -b, line1.Point1.Y - line2.Point1.Y ],
				[ f, -c, line1.Point1.Z - line2.Point1.Z ]
			]
		);
		upperTriangular = matrix.toUpperTriangular();
		if (upperTriangular.e(2, 2) === 0) {
			if (upperTriangular.e(2, 3) !== 0) {
				return undefined;
			}
			if (sameInXAndY) {
				throw new Error("It appears you have passed indentical lines to getPointOfIntersection.");
			}
			return line1.getPointAtT(t1);
		}
		t2 = upperTriangular.e(2, 3) / upperTriangular.e(2, 2);
		if (t2 < 0 || t1 > 1) { return undefined; }
		s2 = (upperTriangular.e(1, 3) / upperTriangular.e(1, 1)) -
				(upperTriangular.e(1, 2) * s1 / upperTriangular.e(1, 1));
		if (s2 < 0 || s2 > 1) { return undefined; }
		if (sameInXAndY) {
			return line1.getPointAtT(t2);
		}
		if (t1 === t2 && s1 === s2) {
			return line1.getPointAtT(t2);
		}
		return undefined;
	};

	this.Map = function (value) {
		if (arguments.length === 0) {
			return map;
		}
		map = value;
	};

	this.linesMeetOnlyAtEndPoints = function () {
		var lines, line1, line2, line1Direction, line2Direction, j, linesToCheck, k,
			pointOfIntersection, t;
		lines = map.lines();
		for (j = 0; j < lines.length - 1; ++j) {
			line1 = lines[j];
			line1Direction = line1.direction();
			linesToCheck = lines.slice(j + 1);
			for (k = 0; k < linesToCheck.length; ++k) {
				line2 = linesToCheck[k];
				if (line1.equals(line2)) {
					return false;
				}
				line2Direction = line2.direction();
				if (!directionsAreProportional(line1Direction, line2Direction)) {
					pointOfIntersection = getPointOfIntersection(line1, line2);
					if (undefined !== pointOfIntersection) {
						if (!pointOfIntersection.equals(line1.Point1) &&
							!pointOfIntersection.equals(line1.Point2)) {
							return false;
						}
						if (!pointOfIntersection.equals(line2.Point1) &&
							!pointOfIntersection.equals(line2.Point2)) {
							return false;
						}
					}
				} else {
					//our lines have proportional directions
					t = {};
					if (line1.ContainsPoint(line2.Point1, t)) {
						if (t.value > 0 && t.value < 1) {
							return false;
						}
						t.value = undefined;
					}
					if (line1.ContainsPoint(line2.Point2, t)) {
						if (t.value > 0 && t.value < 1) {
							return false;
						}
						t.value = undefined;
					}
					if (line2.ContainsPoint(line1.Point1, t)) {
						if (t.value > 0 && t.value < 1) {
							return false;
						}
						t.value = undefined;
					}
					if (line2.ContainsPoint(line1.Point2, t)) {
						if (t.value > 0 && t.value < 1) {
							return false;
						}
						t.value = undefined;
					}
				}
			}
		}
		return true;
	};
}
