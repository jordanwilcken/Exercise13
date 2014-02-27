function Game(pacmanArg, ghostsArg, mapArg) {
	var pacman, ghosts, map;
	pacman = pacmanArg;
	ghosts = ghostsArg;
	map = mapArg;

	this.ghosts = function (commaSeparatedGhosts) {
		var ghostArray, stringArray, ghost, j;
		ghostArray = [];
		if (arguments.length === 0) {
			return ghosts;
		}
		stringArray = commaSeparatedGhosts.split(",");
		if (stringArray.length === 1) {
			return ghosts[stringArray[0]];
		}
		for (j = 0; j < stringArray.length; ++j) {
			ghost = ghosts[stringArray[j]];
			if (ghost !== undefined) {
				ghostArray.push(ghost);
			}
		}
		return ghostArray;
	};
}
