function Circle(center, theRadius) {
	var radius, circle;
	radius = theRadius;

	if (arguments.length === 1) {
		circle = center;
		return new Circle(circle.Center, circle.Radius());
	}

	this.Center = center;
	this.Radius = function (value) {
		if (arguments.length === 0) {
			return radius;
		}

		if (undefined === value) {
			throw new Error("You tried to set a circle's radius to undefined.");
		}
		if (value <= 0) {
			throw new Error("You tried to set a circle's radius to be <= 0.");
		}
		radius = value;
	};
}
