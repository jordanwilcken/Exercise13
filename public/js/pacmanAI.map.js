/*
 * module_template.js
 * Template for browser feature modules
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 * Copyright (c) 2011-2012 Manning Publications Co.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, LineSegment, Point, Pacman, Clyde, Map, Game, Judge,
         ObjectThatDraws, Point, pacmanAI, TimeSpan
*/

pacmanAI.map = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<canvas id="pacmanAI-map-theCanvas"></canvas>'
    },
    stateMap  = {},
    jqueryMap = {},

    setJqueryMap, configModule, initModule, onAdmittedGhostsChanged,
    map,
    admittedGhosts = [];
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = { $container : $container };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // example: onClickButton = ...
  // 

  onAdmittedGhostsChanged = function (event, ghostList) {
    var
      newlyAdmittedGhosts = [],
      somePoint = new Point(0, 0);

    ghostList.forEach(function (ghost) {
      if (!admittedGhosts.some(function (previouslyAdmittedGhost) {
        return previouslyAdmittedGhost.name === ghost.name;
      })) {
        newlyAdmittedGhosts.push(ghost);
      }
    });

    newlyAdmittedGhosts.forEach(function (ghost) {
      ghost.set_Map(map);
      ghost.Position(map.GetPointClosestTo(somePoint));
    });

    admittedGhosts = ghostList.slice(); 
  };
  //-------------------- END EVENT HANDLERS --------------------



  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /configModule/
  // Purpose    : Adjust configuration of allowed keys
  // Arguments  : A map of settable keys and values
  // Settings   :
  //   * configMap.settable_map declares allowed keys
  // Returns    : true
  // Throws     : none
  //
  configModule = function ( input_map ) {
    pacmanAI.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };
  // End public method /configModule/

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule = function ( $container ) {
    stateMap.$container = $container;
    setJqueryMap();

    $container.html(configMap.main_html);

    var onTwentyMillisecondTimeout, on100MillisecondTimeout,
      makeMapLines = function () {
        return [

          //Perimeter lines
          new LineSegment(new Point(175, 30), new Point(325, 30)),
          new LineSegment(new Point(325, 30), new Point(325, 180)),
          new LineSegment(new Point(325, 180), new Point(475, 180)),
          new LineSegment(new Point(475, 180), new Point(475, 330)),
          new LineSegment(new Point(475, 330), new Point(325, 330)),
          new LineSegment(new Point(325, 330), new Point(325, 480)),
          new LineSegment(new Point(325, 480), new Point(175, 480)),
          new LineSegment(new Point(175, 480), new Point(175, 330)),
          new LineSegment(new Point(175, 330), new Point(25, 330)),
          new LineSegment(new Point(25, 330), new Point(25, 180)),
          new LineSegment(new Point(25, 180), new Point(175, 180)),
          new LineSegment(new Point(175, 180), new Point(175, 30)),

          //Interior square
          new LineSegment(new Point(175, 180), new Point(325, 180)),
          new LineSegment(new Point(325, 180), new Point(325, 330)),
          new LineSegment(new Point(325, 330), new Point(175, 330)),
          new LineSegment(new Point(175, 330), new Point(175, 180))
        ];
      },
      makeMapPortals = function () {
        return [];
      },
      pacman = new Pacman(),
      game = new Game(pacman, {}, map),
      judge = new Judge(game),
      objectThatDraws = new ObjectThatDraws(),
      theCanvas = $("#pacmanAI-map-theCanvas"),
      thingsThatCareAboutThePassageOfTime = [
        judge
      ];

    map = new Map(makeMapLines(), makeMapPortals());
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

    onTwentyMillisecondTimeout = function () {
      var timeSpan, timeBetweenCalls, j;
      if (undefined === this.TimeOfPreviousCall) {
        this.TimeOfPreviousCall = new Date();
      } else {
        timeBetweenCalls = new Date() - this.TimeOfPreviousCall;
        this.TimeOfPreviousCall = new Date();
        timeSpan = new TimeSpan(timeBetweenCalls, "ms");
        admittedGhosts.forEach( function (ghost) {
          ghost.observeEnemy(pacman);
          ghost.ResolveTimePassing(timeSpan);
        });
      }

      setTimeout(onTwentyMillisecondTimeout, 25);
    };
    setTimeout(onTwentyMillisecondTimeout, 25);

    on100MillisecondTimeout = function () {
      var timeBetweenCalls, j;
      if (undefined === this.TimeOfPreviousCall) {
        this.TimeOfPreviousCall = new Date();
      } else {
        timeBetweenCalls = new Date() - this.TimeOfPreviousCall;
        this.TimeOfPreviousCall = new Date();
        objectThatDraws.Clear();
        map.Draw();
        objectThatDraws.DrawFilledCircle(pacman.circle, pacman.strokeColor, pacman.fillColor);
        admittedGhosts.forEach( function (ghost) {
          objectThatDraws.DrawFilledCircle(ghost.circle, ghost.strokeColor, ghost.fillColor);
          ghost.ChoosePath();
        });
      }
      setTimeout(on100MillisecondTimeout, 100);
    };
    setTimeout(on100MillisecondTimeout, 100);

    $.gevent.subscribe(jqueryMap.$container, 'admitted-ghosts-changed', onAdmittedGhostsChanged);
    
    return true;
  };
  // End public method /initModule/

  // return public methods
  return {
    configModule : configModule,
    initModule   : initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
}());
