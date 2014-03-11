var Circle, Point, ObjectThatDraws;

function Pacman() {
	var position;
	this.strokeColor = "yellow";
  this.fillColor = 'yellow';
	position = new Point(100, 100);
	this.circle = new Circle(position, 20);

	this.Position = function (point) {
		if (arguments.length === 0) {
			return this.circle.Center;
		}
		this.circle.Center = point;
	};
}
