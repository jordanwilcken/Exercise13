/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, pacmanAI, Circle, Point, Pacman */

pacmanAI.model.ghostFactory = (function () {
	var
    objectThatDraws,
		ghostProto, makeGhost,
    speedInPixelsPerMS = 60 / 1000;

  ghostProto = {
    FollowPath  : function (path, distance) {
      var newDistance;
      newDistance = path.getDistanceAtPoint(this.Position()) + distance;
      if (newDistance > path.length()) {
        this.Position(path.endPoint());
      } else {
        this.Position(path.getPointAt(newDistance));
      }
    },
    ResolveTimePassing : function (timeSpan) {
      var milliseconds;
      milliseconds = timeSpan.ToMilliseconds();
      if (milliseconds === 0) {
        return;
      }
      if (undefined !== this.currentPath) {
        this.FollowPath(this.currentPath, speedInPixelsPerMS * milliseconds);
      }
    }
  };

  makeGhost = function (attr_map) {
    var
      enemy,
      theGhost = Object.create(ghostProto);

    if (attr_map.hasOwnProperty('name') && attr_map.name.length > 0) {
      theGhost.name = attr_map.name;
    } else {
      theGhost.name = 'Clyde';
    }

    if (attr_map.hasOwnProperty('strokeColor') && attr_map.name.length > 0) {
      theGhost.strokeColor = attr_map.strokeColor;
    } else {
      theGhost.strokeColor = 'red';
    }

    if (attr_map.hasOwnProperty('fillColor') && attr_map.name.length > 0) {
      theGhost.fillColor = attr_map.fillColor;
    } else {
      theGhost.fillColor = 'red';
    }

    theGhost.circle = new Circle(new Point(0, 0), 20);

    theGhost.ChoosePath = function () {
      var shortestPathToPacman;
      if (undefined === this.map) {
        //some default path for when we have no map
        return;
      }
      if (undefined === enemy || enemy.Position() === undefined) {
        return;
      }
      shortestPathToPacman = this.map.getShortestPathFromAToB(this.Position(), enemy.Position());
      if (undefined === shortestPathToPacman) {
        //throw new Error("Clyde.js says 'There is no way to get to Pacman!'");
      } else {
        this.currentPath = shortestPathToPacman;
      }
    };

    theGhost.observeEnemy = function (enemyArg) {
      enemy = enemyArg;
    };

    theGhost.get_Map = function() {
      return this.map;
    };

    theGhost.set_Map = function (value) {
      if (arguments.length === 0) {
        return this.map;
      }
      this.map = value;
    };

    theGhost.Position = function (point) {
      if (arguments.length === 0) {
        return this.circle.Center;
      }
      this.circle.Center = point;
    };

    return theGhost;
  };

  return {
    makeGhost : makeGhost
  };
}());
