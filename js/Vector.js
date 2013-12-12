var Point;

function Vector(someX, someY, someZ) {
	var toCopy;

	if (arguments.length === 1) {
		toCopy = someX;
		return new Vector(toCopy.X, toCopy.Y, toCopy.Z);
	}
	this.X = someX;
	this.Y = someY;
	if (undefined === someZ) {
		this.Z = 0;
	} else {
		this.Z = someZ;
	}

	this.Dot = function (vector) {
		return (this.X * vector.X) + (this.Y * vector.Y) + (this.Z * vector.Z);
	};

	this.equals = function (vector) {
		return this.X === vector.X &&
				this.Y === vector.Y &&
				this.Z === vector.Z;
	};

	this.IsParallelTo = function (vector) {
		var dotProduct, magnitudeProduct;
		dotProduct = this.Dot(vector);
		magnitudeProduct = this.Magnitude() * vector.Magnitude();
		return (dotProduct === magnitudeProduct || dotProduct === -1 * magnitudeProduct);
	};

	this.IsPerpendicularTo  = function (vector) {
		return this.Dot(vector) === 0;
	};

	this.Magnitude = function () {
		return Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2) + Math.pow(this.Z, 2));
	};

	this.Normalize = function () {
		var magnitude = this.Magnitude();
		if (magnitude === 0) {
			throw new Error("You cannot normalize the Zero Vector.");
		}
		this.X /= magnitude;
		this.Y /= magnitude;
		this.Z /= magnitude;
	};

	this.Plus = function (vector) {
		return new Vector(this.X + vector.X, this.Y + vector.Y, this.Z + vector.Z);
	};

	this.plusEquals = function (vector) {
		this.X += vector.X;
		this.Y += vector.Y;
		this.Z += vector.Z;
	};

	this.Times = function (scalar) {
		return new Vector(scalar * this.X, scalar * this.Y, scalar * this.Z);
	};

	this.toPoint = function () {
		return new Point(this.X, this.Y, this.Z);
	};

	this.toString = function () {
		return this.X + ", " + this.Y + ", " + this.Z;
	};
}
