var Circle, Pacman, Point, ObjectThatDraws, Path;

function Clyde() {
	var circle, strokeColor, fillColor, objectThatDraws, map,
		speedInPixelsPerMS, currentPath, pacmansPosition;
	strokeColor = fillColor = "red";
	circle = new Circle(new Point(0, 0), 20);
	objectThatDraws = new ObjectThatDraws();
	speedInPixelsPerMS = 60 / 1000;

	this.ChoosePath = function () {
		var shortestPathToPacman, map;
		map = this.Map();
		if (undefined === map) {
			//some default path for when we have no map
			return;
		}
		if (undefined === pacmansPosition) {
			throw new Error("Clyde doesn't know where Pacman is.");
		}
		shortestPathToPacman = map.getShortestPathFromAToB(this.Position(), pacmansPosition);
		if (undefined === shortestPathToPacman) {
			//throw new Error("Clyde.js says 'There is no way to get to Pacman!'");
		} else {
			currentPath = shortestPathToPacman;
		}
	};

  this.get_Map = function() {
    return map;
  }

	this.set_Map = function (value) {
		if (arguments.length === 0) {
			return map;
		}
		map = value;
	};

	this.Position = function (point) {
		if (arguments.length === 0) {
			return circle.Center;
		}
		circle.Center = point;
	};

	this.Draw = function () {
		objectThatDraws.DrawFilledCircle(circle, strokeColor, fillColor);
	};

	this.FollowPath = function (path, distance) {
		var newDistance;
		newDistance = path.getDistanceAtPoint(this.Position()) + distance;
		if (newDistance > path.length()) {
			this.Position(path.endPoint());
		} else {
			this.Position(path.getPointAt(newDistance));
		}
	};

	this.observeEnemy = function (enemy) {
		if (enemy instanceof Pacman) {
			pacmansPosition = enemy.Position();
		} else {
			pacmansPosition = undefined;
		}
	};

	this.ResolveTimePassing = function (timeSpan) {
		var milliseconds;
		milliseconds = timeSpan.ToMilliseconds();
		if (milliseconds === 0) {
			return;
		}
		if (undefined !== currentPath) {
			this.FollowPath(currentPath, speedInPixelsPerMS * milliseconds);
		}
	};
}
