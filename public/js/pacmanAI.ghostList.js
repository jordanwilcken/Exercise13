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

pacmanAI.ghostList = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<div id="ghost_list"></div>'
        + '<div id="add_ghost">Add</div>'
        + '<div id="delete_ghost">Delete</div>',
      settable_map : {
        map_model     : true,
        on_tap_add    : true,
        on_tap_delete : true
      }
    },
    stateMap  = {},
    jqueryMap = {},

    setJqueryMap, configModule, initModule, onTapAdd, onTapDelete;
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

  onListChange = function (evnt) {
    var
      list_html = String(),
      ghost_db = configMap.ghosts_model.get_db(),
      selected_ghosts = configMap.ghosts_model.get_selected_ghosts();

      ghost_db.each (function (ghost, idx) {
        var select_class = '';

        selected_ghosts.each(function (selected, idx) {
          if (ghost && ghost.id === selected.id) {
            select_class = '-x-select';
          }
        });

        list_html
          += '<div class="pacmanAI-ghostList-item' +  select_class + '"'
          +  ' data-id="' + ghost.id + '">'
          +  pacmanAI.util_b.encodeHtml(ghost.name) + '</div>';
      });

      jqueryMap.$list.html(list_html);
  };

  onTapAdd = function (evnt) {
    configMap.on_tap_add();
  };

  onTapDelete = function (evnt) {
    var
      ghost_db, 
      selectedGhosts = configMap.ghosts_model.get_selected_ghosts();
    if (selectedGhosts.length === 0)
    {
      return;
    }

    //if they confirm the delete
    ghost_db = configMap.ghosts_model.get_db();
    //use ghost_db to remove those ghosts
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
    jqueryMap.$list = $("#ghost_list");
    $("#add_ghost").on("utap", onTapAdd);
    $("#delete_ghost").on("utap", onTapDelete);
    return true;
  };
  // End public method /initModule/

  // Begin public method /getSelectedGhosts/
  // Purpose    : To expose which ghosts are selected
  // Arguments  : none
  // Returns    : An array of ghosts
  // Throws     : none
  //
  getSelectedGhosts = function () {
    selected = 
  };

  // return public methods
  return {
    configModule : configModule,
    initModule   : initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
}());
