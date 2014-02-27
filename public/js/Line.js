var Vector;

function Line(point1, point2) {
	var line;

	if (arguments.length === 1) {
		line = point1;
		return new Line(Line.Point1, Line.Point2);
	}
	this.Point1 = point1;
	this.Point2 = point2;

	this.GetPointClosestTo = function (point) {
	};

	this.ContainsPoint = function (point) {
		var direction, t;
		direction = new Vector(this.Point2.X - this.Point1.X,
								this.Point2.Y - this.Point1.Y,
								this.Point2.Z - this.Point1.Z);
		if (direction.X === 0) {
			if (point.X !== this.Point1.X) {
				return false;
			}
		} else {
			t = (point.X - this.Point1.X) / direction.X;
		}

		if (direction.Y === 0) {
			if (point.Y !== this.Point1.Y) {
				return false;
			}
		} else {
			if (undefined === t) {
				t = (point.Y - this.Point1.Y) / direction.Y;
			} else if (t !== (point.Y - this.Point1.Y) / direction.Y) {
				return false;
			}
		}

		if (direction.Z === 0) {
			if (point.Z !== this.Point1.Z) {
				return false;
			}
		} else {
			if (undefined === t) {
				t = (point.Z - this.Point1.Z) / direction.Z;
			} else if (t !== (point.Z - this.Point1.Z) / direction.Z) {
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
}
