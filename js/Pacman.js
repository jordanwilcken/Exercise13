var Circle, Point, ObjectThatDraws;

function Pacman() {
	var position, circle, strokeColor, fillColor, objectThatDraws;
	strokeColor = fillColor = "yellow";
	position = new Point(100, 100);
	circle = new Circle(position, 20);
	objectThatDraws = new ObjectThatDraws();

	this.Position = function (point) {
		if (arguments.length === 0) {
			return circle.Center;
		}
		circle.Center = point;
	};

	this.Draw = function () {
		objectThatDraws.DrawFilledCircle(circle, strokeColor, fillColor);
	};
}
