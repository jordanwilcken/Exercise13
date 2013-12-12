var $, Map, makeMapLines, makeMapPortals, Judge, ObjectThatDraws, TimeSpan, LineSegment, Point,
	Pacman, Clyde;

$(function () {
	var map, thingsToDrawOnMap, judge, objectThatDraws, onTwentyMillisecondTimeout,
		twentyMillisecondTimeoutID,	on100MillisecondTimeout, timeBetweenCalls, j,
		the100MillisecondTimeoutID, pacman, theCanvas, clyde, thingsThatCareAboutThePassageOfTime;

	pacman = new Pacman();
	clyde = new Clyde();
	map = new Map(makeMapLines(), makeMapPortals());
	clyde.Position(map.GetPointClosestTo(new Point(0, 0)));

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

	judge = new Judge();

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
			for (j = 0; j < thingsThatCareAboutThePassageOfTime.length; ++j) {
				thingsThatCareAboutThePassageOfTime[j].ResolveTimePassing(timeSpan);
			}
		}
		setTimeout(onTwentyMillisecondTimeout, 20);
	};
	twentyMillisecondTimeoutID = setTimeout(onTwentyMillisecondTimeout, 20);

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
		setTimeout(on100MillisecondTimeout, 100);
	};
	the100MillisecondTimeoutID = setTimeout(on100MillisecondTimeout, 100);
});

function makeMapLines() {
	return [
		new LineSegment(new Point(30, 30), new Point(30, 470)),
		new LineSegment(new Point(30, 470), new Point(470, 470)),
		new LineSegment(new Point(470, 470), new Point(470, 30)),
		new LineSegment(new Point(470, 30), new Point(30, 30))
	];
}

function makeMapPortals() {
	return [];
}
