function Judge(gameArg) {
	var game, clyde, timeSinceClydesLastDecisionInMS, timeForClydeToMakeADecision;
	this.game = function (value) {
		if (arguments.length === 0) {
			return game;
		}
		game = value;
		clyde = game.ghosts("Clyde");
	};

	this.ResolveTimePassing = function (timeSpan) {
		if (undefined != timeSinceClydesLastDecisionInMS) {
			timeSinceClydesLastDecisionInMS += timeSpan.ToMilliseconds();
		}
		if (timeForClydeToMakeADecision()) {
			clyde.ChoosePath();
			timeSinceClydesLastDecisionInMS = 0;
		}
	};

	timeForClydeToMakeADecision = function () {
		if (undefined === timeSinceClydesLastDecisionInMS) {
			return true;
		}
		return timeSinceClydesLastDecisionInMS > 500;
	};

	if (gameArg === undefined) {
		throw new Error("You cannot pass an undefined game to the Judge function.");
	}
	this.game(gameArg);
}
