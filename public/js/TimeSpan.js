function TimeSpan(theNumber, theUnits) {
	var number, units;
	number = theNumber;
	units = theUnits;

	this.ToMilliseconds = function () {
		if (units === "ms") {
			return number;
		}
		throw new Error("There is not yet a conversion from "
						+ units + " to ms in the TimeSpan prototype.");
	};
}
