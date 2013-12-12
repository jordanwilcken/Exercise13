var Circle, Pacman, Point, ObjectThatDraws, Path;

function Clyde() {
	var position, circle, strokeColor, fillColor, objectThatDraws, map,
		speedInPixelsPerMS, currentPath, pacmansPosition;
	strokeColor = fillColor = "red";
	circle = new Circle(position, 20);
	objectThatDraws = new ObjectThatDraws();
	speedInPixelsPerMS = 20 / 1000;

	this.ChoosePath = function () {
		var shortestPathToPacman, map;
		map = this.Map();
		if (undefined === map) {
			//some default path for when we have no map
			return;
		}
		shortestPathToPacman = map.GetShortestPathFromAToB(pacmansPosition);
		if (undefined === shortestPathToPacman) {
			//path that causes you to pace on line that will bring you closest
		} else {
			currentPath = shortestPathToPacman;
		}
	};

	this.Map = function (value) {
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
		this.Position(path.GetPointAt(distance));
	};

	this.ObserveEnemy = function (enemy) {
		if(typeof enemy === typeof Pacman) {
			pacmansPosition = enemy.Position();
		} else {
			pacmansPosition = undefined;
		}
	};

	this.ResolveTimePassing = function (timeSpan) {
		FollowPath(currentPath, speedInPixelsPerMS * timeSpan.ToMilliseconds());
	};
}