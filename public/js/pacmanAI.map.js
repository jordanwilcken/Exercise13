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

    setJqueryMap, configModule, initModule;
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
          new LineSegment(new Point(30, 30), new Point(30, 470)),
          new LineSegment(new Point(30, 470), new Point(470, 470)),
          new LineSegment(new Point(470, 470), new Point(470, 30)),
          new LineSegment(new Point(470, 30), new Point(30, 30)),
          new LineSegment(new Point(30, 470), new Point(200, 200))
        ];
      },
      makeMapPortals = function () {
        return [];
      },
      pacman = new Pacman(),
      clyde = new Clyde(),
      map = new Map(makeMapLines(), makeMapPortals()),
      game = new Game(pacman, { Clyde: clyde }, map),
      judge = new Judge(game),
      objectThatDraws = new ObjectThatDraws(),
      theCanvas = $("#pacmanAI-map-theCanvas"),
      thingsThatCareAboutThePassageOfTime = [
        judge,
        clyde
      ];

    pacmanAI.model.ghosts.add(clyde);
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

    clyde.set_Map(map);
    clyde.Position(map.GetPointClosestTo(new Point(0, 0)));
    clyde.observeEnemy(pacman);
    clyde.ChoosePath();

    onTwentyMillisecondTimeout = function () {
      var timeSpan, timeBetweenCalls, j;
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
      //setTimeout(onTwentyMillisecondTimeout, 25);
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
        objectThatDraws.DrawFilledCircle(clyde.circle, clyde.strokeColor, clyde.fillColor);
      }
      //setTimeout(on100MillisecondTimeout, 50);
    };
    setTimeout(on100MillisecondTimeout, 50);

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
