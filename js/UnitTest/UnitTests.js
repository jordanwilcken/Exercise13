var test, ok, Vector, LineSegment, Point, Map, MapEvaluator;

test("dot test", function () {
	var vector1, vector2, vector3, calculated, expected;

	vector1 = new Vector(1, 2, 3);
	vector2 = new Vector(0, -0.76, -78);
	vector3 = new Vector(0.95, 0, 9.89);
	calculated = vector1.Dot(vector2);
	expected = (vector1.X * vector2.X)
				+ (vector1.Y * vector2.Y) + (vector1.Z * vector2.Z);
	ok(calculated === expected,
		"Dot function returned " + calculated + ", but " + expected + " was expected.");

	calculated = vector2.Dot(vector3);
	expected = (vector2.X * vector3.X)
				+ (vector2.Y * vector3.Y) + (vector2.Z * vector3.Z);
	ok(calculated === expected,
		"Dot function returned " + calculated + ", but " + expected + " was expected.");

	calculated = vector3.Dot(vector1);
	expected = (vector3.X * vector1.X)
				+ (vector3.Y * vector1.Y) + (vector3.Z * vector1.Z);
	ok(calculated === expected,
		"Dot function returned " + calculated + ", but " + expected + " was expected.");
});

test("parallel test", function () {
	var xAxis, zAxis, parallelToX, parallelToZ;
	xAxis = new Vector(1, 0, 0);
	zAxis = new Vector(0, 0, 1);
	parallelToX = new Vector(-4, 0, 0);
	parallelToZ = new Vector(0, 0, 0.54);

	ok(parallelToX.IsParallelTo(xAxis));
	ok(parallelToZ.IsParallelTo(zAxis));
	ok(parallelToX.IsParallelTo(parallelToZ) === false);
});

test("perpendicular test", function () {
	var xAxis, zAxis, perpendicularToX, perpendicularToZ;
	xAxis = new Vector(1, 0, 0);
	zAxis = new Vector(0, 0, 1);
	perpendicularToX = new Vector(-4, 0, 0);
	perpendicularToZ = new Vector(0, 0, 0.54);

	ok(perpendicularToX.IsPerpendicularTo(zAxis));
	ok(perpendicularToZ.IsPerpendicularTo(xAxis));
	ok(perpendicularToX.IsPerpendicularTo(perpendicularToZ));
	ok(perpendicularToX.IsPerpendicularTo(xAxis) === false);
});

test("ContainsPoint test", function () {
	var point1, point2, midpoint, uncontainedPoint, lineSegment, verticalLineSegment, t;
	point1 = new Point(3, -4.5, 0);
	point2 = new Point(-7.11, 0.13, 12);
	midpoint = new Point((point1.X + point2.X) / 2,
						 (point1.Y + point2.Y) / 2,
						 (point1.Z + point2.Z) / 2);
	uncontainedPoint = new Point(23, -4.6, 15);
	lineSegment = new LineSegment(point1, point2);
	verticalLineSegment = new LineSegment(point1, new Point(point1.X, point1.Y + 1, point1.Z));
	ok(lineSegment.ContainsPoint(point1, {}));
	ok(lineSegment.ContainsPoint(point2, {}));
	ok(lineSegment.ContainsPoint(midpoint, {}));
	ok(lineSegment.ContainsPoint(uncontainedPoint, {}) === false);
	ok(verticalLineSegment.ContainsPoint(point1, {}));
	ok(verticalLineSegment.ContainsPoint(uncontainedPoint, {}) === false);
});

test("LineSegment.GetPointClosestTo test", function () {
	var lineSegment, uncontainedPoint, closestPoint;
	lineSegment = new LineSegment(new Point(1, 1), new Point(3, 3));
	uncontainedPoint = new Point(4, 4);
	closestPoint = lineSegment.GetPointClosestTo(uncontainedPoint);
	ok(closestPoint.X === lineSegment.Point2.X);
	ok(closestPoint.Y === lineSegment.Point2.Y);

	uncontainedPoint = new Point(1, 3);
	closestPoint = lineSegment.GetPointClosestTo(uncontainedPoint);
	ok(closestPoint.X === 2);
	ok(closestPoint.Y === 2);
});

test("Vector.Magnitude test", function () {
	var theVector, calculated, expected, message;
	theVector = new Vector(-3, 2, -6);
	calculated = theVector.Magnitude();
	expected = 7;
	message = "The magnitude of the vector " + theVector.X + ", " + theVector.Y
				+ ", " + theVector.Z + " is " + expected + ", not " + calculated + ".";
	ok(calculated === expected, message);
});

test("Vector.Normalize test", function () {
	var theVector;
	theVector = new Vector(2, -3, -6);
	theVector.Normalize();
	ok(theVector.X === 2 / 7);
	ok(theVector.Y === -3 / 7);
	ok(theVector.Z === -6 / 7);
	ok((theVector.Magnitude() - 1) < 0.001);
});

test("Map.GetPointClosestTo test", function () {
	var map, testPoint, calculatedClosestPoint, closestPoint;
	map = new Map(
		[
			new LineSegment(new Point(0, 0), new Point(0, 2)),
			new LineSegment(new Point(0, 2), new Point(2, 2)),
			new LineSegment(new Point(2, 2), new Point(2, 0)),
			new LineSegment(new Point(2, 0), new Point(0, 0))
		],
		[]
	);
	testPoint = new Point(-17, 1);
	calculatedClosestPoint = map.GetPointClosestTo(testPoint);
	closestPoint = new Point(0, 1);
	ok(calculatedClosestPoint.X === closestPoint.X,
		"calculatedClosestPoint.X was " + calculatedClosestPoint.X +
		", but it should have been " + closestPoint.X + "."
	  );
	ok(calculatedClosestPoint.Y === closestPoint.Y,
		"calculatedClosestPoint.Y was " + calculatedClosestPoint.Y +
		", but it should have been " + closestPoint.Y + "."
	  );
});

test("Map.getLinesContainingThePoint test", function () {
	var containingLine1, containingLine2, lineThatDoesNotContain, testPoint, map;
	containingLine1 = new LineSegment(new Point(0, 0), new Point(Math.sqrt(5), Math.sqrt(5)));
	testPoint = new Point(Math.sqrt(2), Math.sqrt(2));
	containingLine2 = new LineSegment(
		new Point(testPoint.X - 1, testPoint.Y + 1),
		new Point(testPoint.X + 1, testPoint.Y - 1)
	);
	lineThatDoesNotContain = new LineSegment(containingLine1.Point1, containingLine2.Point2);
	map = new Map(
		[
			containingLine1,
			containingLine2,
			lineThatDoesNotContain
		],
		[]
	);
	ok(map.getLinesContainingThePoint(testPoint).length === 2,
		"There should be two lines on the map that contain the testPoint.");
	ok(lineThatDoesNotContain.ContainsPoint(testPoint) === false,
		"lineThatDoesNotContain should not contain testPoint.");
});

test("Map.getShortestPathWithoutPortalsFromAToB test", function () {
	var point1, pointA, point2, point3, point4, pointB, point5, point6,
		map, expectedPathAsArrayOfVectors, calculatedPathAsArrayOfVectors,
		expectedPart, calculatedPart, j;
	point1 = new Point(0, 0);
	pointA = new Point(0, 0);
	point2 = new Point(0, 2);
	point3 = new Point(1, 2);
	point4 = new Point(1, 3);
	pointB = new Point(3, 3);
	point5 = new Point(3, 3);
	point6 = new Point(21.5, -11.06);
	map = new Map(
		[
			new LineSegment(point1, point2),
			new LineSegment(point2, point3),
			new LineSegment(point3, point4),
			new LineSegment(point4, point5),
			new LineSegment(pointB, point6),
			new LineSegment(point6, pointA)
		],
		[]
	);
	expectedPathAsArrayOfVectors = [
		new Vector(point2.X - pointA.X, point2.Y - pointA.Y),
		new Vector(point3.X - point2.X, point3.Y - point2.Y),
		new Vector(point4.X - point3.X, point4.Y - point3.Y),
		new Vector(pointB.X - point4.X, pointB.Y - point4.Y)
	];
	calculatedPathAsArrayOfVectors = map.getShortestPathWithoutPortalsFromAToB(pointA, pointB).AsArrayOfVectors();
	ok(calculatedPathAsArrayOfVectors.length === expectedPathAsArrayOfVectors.length,
		"There were a different number of vectors in the calculated and expected array of vectors.");
	for (j = 0; j < expectedPathAsArrayOfVectors.length; ++j) {
		expectedPart = expectedPathAsArrayOfVectors[j];
		calculatedPart = calculatedPathAsArrayOfVectors[j];
		ok(calculatedPart.equals(expectedPart), "The expected vector was " + expectedPart.toString() +
			" but the calculated vector was " + calculatedPart.toString());
	}
	map = new Map(
		[
			new LineSegment(point1, point2),
			new LineSegment(point2, point3),
			new LineSegment(point3, point4),
			new LineSegment(point4, point5),
			new LineSegment(pointB, pointA)
		],
		[]
	);
	expectedPathAsArrayOfVectors = [
		new Vector(pointB.X - pointA.X, pointB.Y - pointA.Y, pointB.Z - pointA.Z)
	];
	calculatedPathAsArrayOfVectors = map.getShortestPathWithoutPortalsFromAToB(pointA, pointB).AsArrayOfVectors();
	ok(calculatedPathAsArrayOfVectors.length === expectedPathAsArrayOfVectors.length,
		"There were a different number of vectors in the calculated and expected array of vectors.");
	for (j = 0; j < expectedPathAsArrayOfVectors.length; ++j) {
		expectedPart = expectedPathAsArrayOfVectors[j];
		calculatedPart = calculatedPathAsArrayOfVectors[j];
		ok(calculatedPart.equals(expectedPart), "The expected vector was " + expectedPart.toString() +
			" but the calculated vector was " + calculatedPart.toString());
	}
});

test("MapEvaluator.linesMeetOnlyAtEndPoints test", function () {
	var map, mapEvaluator;
	map = new Map(
		[
			new LineSegment(new Point(0, 0), new Point(0, 2)),
			new LineSegment(new Point(0, 2), new Point(2, 2)),
			new LineSegment(new Point(2, 2), new Point(2, 0)),
			new LineSegment(new Point(2, 0), new Point(0, 0))
		],
		[]
	);
	mapEvaluator = new MapEvaluator();
	mapEvaluator.Map(map);
	ok(mapEvaluator.linesMeetOnlyAtEndPoints(),
		"mapEvaluator says that the map has lines that touch at points that are not endpoints, " +
		"but that is not the case.");
});
