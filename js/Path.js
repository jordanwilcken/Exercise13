var Vector;

function Path(arg1, arg2) {
	var arrayOfVectors, toCopy, j, startPoint, endPoint;
	this.AppendVector = function (vector) {
		arrayOfVectors.push(vector);
	};

	this.AsArrayOfVectors = function (input) {
		if (arguments.length === 0) {
			return arrayOfVectors;
		}
		arrayOfVectors = input;
	};

	this.endPoint = function () {
		var positionVector;
		if (arguments.length > 0) {
			throw new Error("The setter for Path.endPoint is not yet implemented.");
		}
		positionVector = new Vector(startPoint.X, startPoint.Y, startPoint.Z);
		for (j = 0; j < arrayOfVectors.length; ++j) {
			positionVector.plusEquals(arrayOfVectors[j]);
		}
		return positionVector.toPoint();
	};

	this.equals = function (path) {
		var otherArrayOfVectors;
		if (!startPoint.equals(path.startPoint())) {
			return false;
		}
		otherArrayOfVectors = path.AsArrayOfVectors();
		if (arrayOfVectors.length !== otherArrayOfVectors.length) {
			return false;
		}
		for (j = 0; j < arrayOfVectors.length; ++j) {
			if (!arrayOfVectors[j].equals(otherArrayOfVectors[j])) {
				return false;
			}
		}
		return true;
	};

	// Returns position along the path given a distance from
	// the startPoint.
	this.getPointAt = function (distance) {
		var point, tracedDistance, nextVector, magnitude, amountNeeded;
		if (distance < 0) {
			throw new Error("You cannot pass a distance of zero to Path.getPointAt.");
		}
		if (distance > this.length()) {
			throw new Error("You cannot pass a distance > Path.length to Path.getPointAt.");
		}
		if (distance === 0) {
			return startPoint;
		}
		point = startPoint;
		tracedDistance = 0;
		for (j = 0; j < arrayOfVectors.length; ++j) {
			nextVector = arrayOfVectors[j];
			magnitude = nextVector.Magnitude();
			if (tracedDistance + magnitude === distance) {
				point = point.plus(nextVector);
				break;
			}
			if (tracedDistance + magnitude > distance) {
				amountNeeded = (distance - tracedDistance) / magnitude;
				point = point.plus(nextVector.Times(amountNeeded));
				break;
			} else {
				point = point.plus(nextVector);
				tracedDistance += magnitude;
			}
		}
		return point;
	};

	this.length = function () {
		var j, length;
		for (j = 0; j < arrayOfVectors.length; ++j) {
			if (undefined === length) {
				length = 0;
			}
			length += arrayOfVectors[j].Magnitude();
		}
		return length;
	};

	this.startPoint = function (value) {
		if (arguments.length === 0) {
			return startPoint;
		}
		startPoint = value;
	};

	if (arguments.length === 2) {
		this.startPoint(arg1);
		arrayOfVectors = arg2;
	} else if (arg1 instanceof Path) {
		this.startPoint(arg1.startPoint());
		arrayOfVectors = [];
		toCopy = arg1.AsArrayOfVectors();
		for (j = 0; j < toCopy.length; ++j) {
			arrayOfVectors.push(toCopy[j]);
		}
	}

	if (undefined === arrayOfVectors) {
		arrayOfVectors = [];
	}

}
