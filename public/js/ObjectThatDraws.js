var $;

function ObjectThatDraws() {
	var canvas = $("#pacmanAI-map-theCanvas")[0];

	this.Clear = function() {
		var context;
		context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	this.DrawLine = function (line, color) {
		var context, originalColor;
		context = canvas.getContext('2d');
		originalColor = context.strokeStyle;
		if (undefined !== color) {
			context.strokeStyle = color;
		}
		context.beginPath();
		context.moveTo(line.Point1.X, line.Point1.Y);
		context.lineTo(line.Point2.X, line.Point2.Y);
		context.stroke();
		context.strokeStyle = originalColor;
	};

	this.DrawFilledCircle = function (circle, strokeColor, fillColor) {
		var context, originalStrokeColor, originalFillColor;
		context = canvas.getContext('2d');
		originalStrokeColor = context.strokeStyle;
		originalFillColor = context.fillStyle;
		if (undefined !== strokeColor) {
			context.strokeStyle = strokeColor;
		}
		if (undefined !== fillColor) {
			context.fillStyle = fillColor;
		}
		context.beginPath();
		context.arc(circle.Center.X, circle.Center.Y, circle.Radius(), 0, 2 * Math.PI);
		context.fill();
		context.strokeStyle = originalStrokeColor;
		context.fillStyle = originalFillColor;
	};
}
