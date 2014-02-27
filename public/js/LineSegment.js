var Point, Vector;

function LineSegment(point1, point2) {
	var lineSegment, numbersCloseEnough;

	if (arguments.length === 1) {
		lineSegment = point1;
		return new LineSegment(lineSegment.Point1, lineSegment.Point2);
	}
	this.Point1 = point1;
	this.Point2 = point2;

	this.direction = function () {
		return new Vector(
			this.Point2.X - this.Point1.X,
			this.Point2.Y - this.Point1.Y,
			this.Point2.Z - this.Point1.Z
		);
	};

	this.equals = function (otherSegment) {
		if (!this.Point1.equals(otherSegment.Point1)) {
			if (!this.Point2.equals(otherSegment.Point1)) {
				return false;
			}
			if (!this.Point1.equals(otherSegment.Point2)) {
				return false;
			}
		} else if (!this.Point2.equals(otherSegment.Point2)) {
			return false;
		}
		return true;
	};

	this.getPointAtT = function (t) {
		if (t < 0 || t > 1) {
			throw new Error("You are dealing with a line segment. " +
				"It is only defined in the range where 0 <= t <= 1.");
		}
		var x, y, z, myDirection;
		myDirection = this.direction();
		return new Point(
			this.Point1.X + (myDirection.X * t),
			this.Point1.Y + (myDirection.Y * t),
			this.Point1.Z + (myDirection.Z * t)
		);
	};

	this.GetPointClosestTo = function (point) {
		var vectorToProject, direction, normalizedDirection, closestPointVector, closestPoint, t,
			length, scale;
		if (this.Length() < 0.00001) {
			return this.Point1;
		}

		if (this.ContainsPoint(point)) {
			return point;
		}

		vectorToProject = new Vector(point.X - this.Point1.X,
										point.Y - this.Point1.Y,
										point.Z - this.Point1.Z);
		direction = new Vector(this.Point2.X - this.Point1.X,
								this.Point2.Y - this.Point1.Y,
								this.Point2.Z - this.Point1.Z);
		normalizedDirection = new Vector(direction);
		normalizedDirection.Normalize();
		length = normalizedDirection.Dot(vectorToProject);
		scale = length / direction.Magnitude();
		closestPointVector = direction.Times(scale).Plus(
			new Vector(
				this.Point1.X,
				this.Point1.Y,
				this.Point1.Z
			)
		);
		closestPoint = new Point(closestPointVector.X, closestPointVector.Y, closestPointVector.Z);
		if (direction.X !== 0) {
			t = (point.X - point1.X) / direction.X;
		} else if (direction.Y !== 0) {
			t = (point.Y - point1.Y) / direction.Y;
		} else {
			t = (point.Z - point1.Z) / direction.Z;
		}

		if (t > 1) {
			return this.Point2;
		}
		if (t < 0) {
			return this.Point1;
		}
		return closestPoint;
	};

	this.ContainsPoint = function (point, t) {
		var direction;
		if (undefined === t) {
			t = {};
		}
		if (this.Length() < 0.00001) {
			if (point.X === this.Point1.X && point.y === this.Point2.Y) {
				return true;
			}
			return false;
		}
		direction = new Vector(this.Point2.X - this.Point1.X,
								this.Point2.Y - this.Point1.Y,
								this.Point2.Z - this.Point1.Z);
		if (direction.X === 0) {
			if (point.X !== this.Point1.X) {
				return false;
			}
		} else {
			t.value = (point.X - this.Point1.X) / direction.X;
			if (t.value < 0 || t.value > 1) {
				return false;
			}
		}

		if (direction.Y === 0) {
			if (point.Y !== this.Point1.Y) {
				return false;
			}
		} else {
			if (undefined === t.value) {
				t.value = (point.Y - this.Point1.Y) / direction.Y;
				if (t.value < 0 || t.value > 1) {
					return false;
				}
			} else if (!numbersCloseEnough(t.value, (point.Y - this.Point1.Y) / direction.Y)) {
				return false;
			}
		}

		if (direction.Z === 0) {
			if (point.Z !== this.Point1.Z) {
				return false;
			}
		} else {
			if (undefined === t.value) {
				t.value = (point.Z - this.Point1.Z) / direction.Z;
				if (t.value < 0 || t.value > 1) {
					return false;
				}
			} else if (!numbersCloseEnough(t.value, (point.Z - this.Point1.Z) / direction.Z)) {
				return false;
			}
		}
		return true;
	};

	this.IsParallelToXAxis = function () {
		return (this.Point1.Y === this.Point2.Y && this.Point1.Z === this.Point2.Z);
	};

	this.IsParallelToYAxis = function () {
		return (this.Point1.X === this.Point2.X && this.Point1.Z === this.Point2.Z);
	};
	this.IsParallelToZAxis = function () {
		return (this.Point1.X === this.Point2.X && this.Point1.Y === this.Point2.Y);
	};

	this.Length = function () {
		return Math.sqrt(
			Math.pow(this.Point2.X - this.Point1.X, 2) +
			Math.pow(this.Point2.Y - this.Point1.Y, 2) +
			Math.pow(this.Point2.Z - this.Point1.Z, 2)
		);
	};

	numbersCloseEnough = function (num1, num2) {
		return Math.abs(num1 - num2) < 0.001;
	};
}
