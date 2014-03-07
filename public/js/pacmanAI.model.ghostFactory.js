/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, pacmanAI, Circle, Point, ObjectThatDraws, Pacman */

pacmanAI.model.ghostFactory = (function () {
	var
    circle,             objectThatDraws, map,
		speedInPixelsPerMS, currentPath,     pacmansPosition, ghostProto, makeGhost;

    circle = new Circle(new Point(0, 0), 20);
    objectThatDraws = new ObjectThatDraws();
    speedInPixelsPerMS = 60 / 1000;

  ghostProto = {
    name : 'Clyde',
    strokeColor : 'red',
    fillColor   : 'red',
    ChoosePath : function () {
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
    },
    get_Map : function() {
      return map;
    },
    set_Map : function (value) {
      if (arguments.length === 0) {
        return map;
      }
      map = value;
    },
    Position : function (point) {
      if (arguments.length === 0) {
        return circle.Center;
      }
      circle.Center = point;
    },
    Draw : function () {
      objectThatDraws.DrawFilledCircle(circle, this.strokeColor, this.fillColor);
    },
    FollowPath : function (path, distance) {
      var newDistance;
      newDistance = path.getDistanceAtPoint(this.Position()) + distance;
      if (newDistance > path.length()) {
        this.Position(path.endPoint());
      } else {
        this.Position(path.getPointAt(newDistance));
      }
    },
    observeEnemy : function (enemy) {
      if (enemy instanceof Pacman) {
        pacmansPosition = enemy.Position();
      } else {
        pacmansPosition = undefined;
      }
    },
    ResolveTimePassing : function (timeSpan) {
      var milliseconds;
      milliseconds = timeSpan.ToMilliseconds();
      if (milliseconds === 0) {
        return;
      }
      if (undefined !== currentPath) {
        this.FollowPath(currentPath, speedInPixelsPerMS * milliseconds);
      }
    }
  };

  makeGhost = function (attr_map) {
    var theGhost = Object.create(ghostProto);
    if (attr_map.hasOwnProperty('name') && attr_map.name.length > 0) {
      theGhost.name = attr_map.name;
    }
    if (attr_map.hasOwnProperty('strokeColor') && attr_map.name.length > 0) {
      theGhost.strokeColor = attr_map.strokeColor;
    }
    if (attr_map.hasOwnProperty('fillColor') && attr_map.name.length > 0) {
      theGhost.fillColor = attr_map.fillColor;
    }
    return theGhost;
  };

  return {
    makeGhost : makeGhost
  };
}());
