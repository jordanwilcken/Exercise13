function Point(x, y, z) {
	var toCopy;
	if (arguments.length === 1) {
		toCopy = x;
		return new Point(toCopy.x, toCopy.y, toCopy.z);
	}

	this.equals = function (point) {
		return this.X === point.X &&
				this.Y === point.Y &&
				this.Z === point.Z;
	};

	this.X = x;
	this.Y = y;
	if (undefined === z) {
		this.Z = 0;
	} else {
		this.Z = z;
	}

	this.DistanceTo = function (point) {
		return Math.sqrt(
			Math.pow(point.X - this.X, 2) +
			Math.pow(point.Y - this.Y, 2) +
			Math.pow(point.Z - this.Z, 2)
		);
	};
	this.plus = function (point) {
		return new Point(this.X + point.X, this.Y + point.Y, this.Z + point.Z);
	};
}
