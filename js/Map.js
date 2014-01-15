var ObjectThatDraws, MapEvaluator, Path, Vector;

function Map(linesArg, portals) {
	var objectThatDraws, isMapValid, mapEvaluator, lines, completePathToPoint, j,
		me;
	me = this;
	objectThatDraws = new ObjectThatDraws();
	lines = linesArg;
	this.portals = portals;

	this.getLinesContainingThePoint = function (point) {
		var j, returnArray;
		returnArray = [];
		for (j = 0; j < lines.length; ++j) {
			if (lines[j].ContainsPoint(point)) {
				returnArray.push(lines[j]);
			}
		}
		return returnArray;
	};

	this.GetPointClosestTo = function (point) {
		var j, line, closestPointOnThisLine, closestPointSoFar, distance, shortestDistanceSoFar;
		for (j = 0; j < lines.length; ++j) {
			line = lines[j];
			closestPointOnThisLine = line.GetPointClosestTo(point);
			distance = closestPointOnThisLine.DistanceTo(point);
			if (closestPointSoFar === undefined || distance < shortestDistanceSoFar) {
				closestPointSoFar = closestPointOnThisLine;
				shortestDistanceSoFar = distance;
			}
		}
		return closestPointSoFar;
	};

	this.getShortestPathFromAToB = function (pointA, pointB) {
		var portalPath, nonPortalPath;
		portalPath = undefined; //this.getShortestPathWithPortalsFromAToB(pointA, pointB);
		nonPortalPath = this.getShortestPathWithoutPortalsFromAToB(pointA, pointB);
		if (undefined !== portalPath && portalPath.length() < nonPortalPath.length()) {
			return portalPath;
		}
		return nonPortalPath;
	};

	this.getShortestPathWithPortalsFromAToB = function (pointA, pointB) {
		throw new Error("Map.getShortestPathWithPortalsFromAToB is not yet implemented.");
	};

	completePathToPoint = function (path, point, visitedLines) {
		var pathAsArrayOfVectors, currentEndPoint, completePaths, subsetOfCompletePaths, pathCopy,
			newPieceOfPath, lastPieceOfPath, line, connectedLines, j, visitedLinesCopy;
		completePaths = [];
		currentEndPoint = path.endPoint();
		connectedLines = me.getLinesContainingThePoint(currentEndPoint);
		for (j = 0; j < connectedLines.length; ++j) {
			line = connectedLines[j];
			if (visitedLines.indexOf(line) !== -1) {
				continue;
			}
			pathCopy = new Path(path);
			if (line.ContainsPoint(point)) {
				lastPieceOfPath = new Vector(
					point.X - currentEndPoint.X,
					point.Y - currentEndPoint.Y,
					point.Z - currentEndPoint.Z
				);
				pathCopy.AppendVector(lastPieceOfPath);
				completePaths.push(pathCopy);
			} else {
				if (!isMapValid) {
					throw new Error("There are lines that meet each other at points that are not endpoints " +
						"and that will require code that is more complicated.");
				}
				if (line.Point1.equals(currentEndPoint)) {
					newPieceOfPath = new Vector(
						line.Point2.X - currentEndPoint.X,
						line.Point2.Y - currentEndPoint.Y,
						line.Point2.Z - currentEndPoint.Z
					);
				} else if (line.Point2.equals(currentEndPoint)) {
					newPieceOfPath = new Vector(
						line.Point1.X - currentEndPoint.X,
						line.Point1.Y - currentEndPoint.Y,
						line.Point1.Z - currentEndPoint.Z
					);
				}
				pathCopy.AppendVector(newPieceOfPath);
				visitedLinesCopy = visitedLines.slice();
				visitedLinesCopy.push(line);
				subsetOfCompletePaths = completePathToPoint(pathCopy, point, visitedLinesCopy);
				while (subsetOfCompletePaths.length > 0) {
					completePaths.push(subsetOfCompletePaths.shift());
				}
			}
		}
		return completePaths;
	};

	this.getShortestPathWithoutPortalsFromAToB = function (pointA, pointB) {
		var linesContainingA, lineContainingA, linesContainingB, j, completePaths, line,
			shortestPath, distance, currentPath, path1, path2, startingVector, k;
		if (!isMapValid) {
			throw new Error("There are lines that meet each other at points that are not endpoints " +
				"and that will require code that is more complicated.");
		}
		linesContainingA = this.getLinesContainingThePoint(pointA);
		linesContainingB = this.getLinesContainingThePoint(pointB);
		if (linesContainingA.length === 0 || linesContainingB.length === 0) {
			return undefined;
		}
		for (j = 0; j < linesContainingA.length; ++j) {
			lineContainingA = linesContainingA[j];
			if (lineContainingA.ContainsPoint(pointB)) {
				return new Path(
					pointA,
					[ new Vector(
						pointB.X - pointA.X,
						pointB.Y - pointA.Y,
						pointB.Z - pointA.Z
					)]
				);
			}
		}

		if (linesContainingA.length === 1) {
			lineContainingA = linesContainingA[0];
			path1 = new Path(
				pointA,
				[
					new Vector(
						lineContainingA.Point2.X - pointA.X,
						lineContainingA.Point2.Y - pointA.Y,
						lineContainingA.Point2.Z - pointA.Z
					)
				]
			);
			path2 = new Path(
				pointA,
				[
					new Vector(
						lineContainingA.Point1.X - pointA.X,
						lineContainingA.Point1.Y - pointA.Y,
						lineContainingA.Point1.Z - pointA.Z
					)
				]
			);
			completePaths = completePathToPoint(path1, pointB, linesContainingA.slice());
			for (j = 0; j < completePaths.length; ++j) {
				currentPath = completePaths[j];
				if (distance === undefined || currentPath.length() < distance) {
					shortestPath = currentPath;
					distance = currentPath.length();
				}
			}
			if (!path1.equals(path2)) {
				completePaths = completePathToPoint(path2, pointB, linesContainingA.slice());
				for (j = 0; j < completePaths.length; ++j) {
					currentPath = completePaths[j];
					if (distance === undefined || currentPath.length() < distance) {
						shortestPath = currentPath;
						distance = currentPath.length();
					}
				}
			}
		} else {
			for (j = 0; j < linesContainingA.length; ++j) {
				lineContainingA = linesContainingA[j];
				if (lineContainingA.getPointAtT(0).equals(pointA)) {
					startingVector = new Vector(
						lineContainingA.Point2.X - pointA.X,
						lineContainingA.Point2.Y - pointA.Y,
						lineContainingA.Point2.Z - pointA.Z
					);
				} else {
					startingVector = new Vector(
						lineContainingA.Point1.X - pointA.X,
						lineContainingA.Point1.Y - pointA.Y,
						lineContainingA.Point1.Z - pointA.Z
					);
				}
				path1 = new Path(
					pointA,
					[startingVector]
				);
				completePaths = completePathToPoint(path1, pointB, linesContainingA.slice());
				for (k = 0; k < completePaths.length; ++k) {
					currentPath = completePaths[k];
					if (distance === undefined || currentPath.length() < distance) {
						shortestPath = currentPath;
						distance = currentPath.length();
					}
				}
			}
		}
		return shortestPath;
	};

	this.Draw = function () {
		var j;
		for (j = 0; j < lines.length; ++j) {
			objectThatDraws.DrawLine(lines[j]);
		}
	};

	this.lines = function () {
		if (arguments.length > 0) {
			throw new Error("You can't set Map.lines. It is get only. " +
				"Map is not currently implemented to properly support changing its lines collection.");
		}
		return lines;
	};

	mapEvaluator = new MapEvaluator();
	mapEvaluator.Map(this);
	isMapValid = mapEvaluator.linesMeetOnlyAtEndPoints();
}
