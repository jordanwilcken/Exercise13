var $, Map, makeMapLines, makeMapPortals, Judge, ObjectThatDraws, TimeSpan, LineSegment, Point,
	Pacman, Clyde, Game;

$(function () {
	var map, thingsToDrawOnMap, judge, objectThatDraws, onTwentyMillisecondTimeout,
		twentyMillisecondTimeoutID,	on100MillisecondTimeout, timeBetweenCalls, j,
		the100MillisecondTimeoutID, pacman, theCanvas, clyde, thingsThatCareAboutThePassageOfTime,
		game;

	pacman = new Pacman();
	clyde = new Clyde();
	map = new Map(makeMapLines(), makeMapPortals());
	clyde.Map(map);
	clyde.Position(map.GetPointClosestTo(new Point(0, 0)));
	clyde.observeEnemy(pacman);
	clyde.ChoosePath();

	theCanvas = $("#theCanvas");
	theCanvas.attr("width", "500");
	theCanvas.attr("height", "500");
	theCanvas.on("click", function (event) {
		var pointClicked, canvasX, canvasY, offset;
		offset = theCanvas.offset();
		canvasX = event.pageX - offset.left;
		canvasY = event.pageY - offset.top;
		pointClicked = new Point(canvasX, canvasY);
		pacman.Position(map.GetPointClosestTo(pointClicked));
	});

	thingsToDrawOnMap = [
		pacman,
		clyde
	];

	game = new Game(pacman, { Clyde: clyde }, map);

	judge = new Judge(game);

	thingsThatCareAboutThePassageOfTime = [
		judge,
		clyde
	];

	objectThatDraws = new ObjectThatDraws();

	onTwentyMillisecondTimeout = function () {
		var timeSpan, timeBetweenCalls;
		if (undefined === this.TimeOfPreviousCall) {
			this.TimeOfPreviousCall = new Date();
		} else {
			timeBetweenCalls = new Date() - this.TimeOfPreviousCall;
			this.TimeOfPreviousCall = new Date();
			timeSpan = new TimeSpan(timeBetweenCalls, "ms");
			clyde.observeEnemy(pacman);
			for (j = 0; j < thingsThatCareAboutThePassageOfTime.length; ++j) {
				thingsThatCareAboutThePassageOfTime[j].ResolveTimePassing(timeSpan);
			}
		}
		setTimeout(onTwentyMillisecondTimeout, 25);
	};
	twentyMillisecondTimeoutID = setTimeout(onTwentyMillisecondTimeout, 25);

	on100MillisecondTimeout = function () {
		if (undefined === this.TimeOfPreviousCall) {
			this.TimeOfPreviousCall = new Date();
		} else {
			timeBetweenCalls = new Date() - this.TimeOfPreviousCall;
			this.TimeOfPreviousCall = new Date();
			objectThatDraws.Clear();
			map.Draw();
			for (j = 0; j < thingsToDrawOnMap.length; ++j) {
				thingsToDrawOnMap[j].Draw();
			}
		}
		setTimeout(on100MillisecondTimeout, 50);
	};
	the100MillisecondTimeoutID = setTimeout(on100MillisecondTimeout, 50);
});

function makeMapLines() {
	return [
		new LineSegment(new Point(30, 30), new Point(30, 470)),
		new LineSegment(new Point(30, 470), new Point(470, 470)),
		new LineSegment(new Point(470, 470), new Point(470, 30)),
		new LineSegment(new Point(470, 30), new Point(30, 30)),
		new LineSegment(new Point(30, 470), new Point(200, 200))
	];
}

function makeMapPortals() {
	return [];
}
