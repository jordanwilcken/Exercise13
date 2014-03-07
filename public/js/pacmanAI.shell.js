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

/*global $, pacmanAI */

pacmanAI.shell = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<div class="pacmanAI-shell-head"></div>'
        + '<div class="pacmanAI-shell-main">'
          + '<div class="pacmanAI-shell-ghostList"></div>'
          + '<div class="pacmanAI-shell-map"></div>'
        + '</div>'
        + '<div class="pacmanAI-shell-foot"></div>'
        + '<div class="pacmanAI-shell-modal"></div>'
    },
    stateMap  = {
      $container : null 
    },
    jqueryMap = {},

    setJqueryMap, configModule, initModule, map, ghostList, startGhostCreation;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = {
      $container : $container,
      $modal     : $("#pacmanAI-shell-modal")
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /startGhostCreation/
  startGhostCreation = function () {
    alert('The user wants to make a ghost');
  };
  // End DOM method /startGhostCreation/
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
    jqueryMap.$ghostListContainer = $(".pacmanAI-shell-ghostList");
    jqueryMap.$mapContainer = $(".pacmanAI-shell-map");

    pacmanAI.ghostList.configModule( {
      ghosts_model : pacmanAI.model.ghosts,
      on_tap_add   : startGhostCreation
    });
    pacmanAI.ghostList.initModule(jqueryMap.$ghostListContainer);
    pacmanAI.map.initModule(jqueryMap.$mapContainer);
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
