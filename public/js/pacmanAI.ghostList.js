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

/*global $, TAFFY, pacmanAI */

pacmanAI.ghostList = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<div class="pacmanAI-ghostList-list"></div>'
        + '<div class="pacmanAI-ghostList-buttons">'
          + '<div class="pacmanAI-ghostList-add pacmanAI-button">Add</div>'
          + '<div class="pacmanAI-ghostList-delete pacmanAI-button">Delete</div>'
          + '<div class="pacmanAI-ghostList-admit pacmanAI-button">Admit to Map</div>'
          + '<div class="pacmanAI-ghostList-eject pacmanAI-button">Remove from Map</div>'
        + '</div>',
      settable_map : {
        ghosts_model  : true,
        map_model     : true,
        on_tap_add    : true,
        on_tap_delete : true
      }
    },
    stateMap  = {},
    jqueryMap = {},

    setJqueryMap, configModule,     initModule,       onTapAdd,     onTapDelete,
    onListChange, onSelectedChange, onAdmittedChange, makeListHtml, onTapList;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  makeListHtml = function() {
    var
      list_html = String(),
      ghost_taffy = configMap.ghosts_model.get_taffy(),
      selected_taffy = TAFFY(configMap.ghosts_model.get_selected());

    ghost_taffy().each (function (ghost, idx) {
      var select_class = '';

      if (selected_taffy(ghost).first()) {
        select_class = '.pacmanAI-x-select';
      }

      list_html
        += '<div class="pacmanAI-ghostList-item' +  select_class + '"'
        +  ' data-id="' + ghost.name + '">'
        +  pacmanAI.util_b.encodeHtml(ghost.name) + '</div>';
    });
    return list_html;
  };
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
      jqueryMap.$list.html(makeListHtml());
  };

  onSelectedChange = function (evnt) {
    var
      name, ghost, $item_div,
      selected_ghosts_taffy = TAFFY(configMap.ghosts_model.get_selected());

    $.each($('.pacmanAI-ghostList-item, .pacmanAI-ghostList-item-selected'), function (idx, itemDiv) {
      $item_div = $(itemDiv);
      name = $item_div.attr('data-id');
      if (selected_ghosts_taffy({ name : name }).first()) {
        $item_div.attr('class', 'pacmanAI-ghostList-item-selected');
      } else {
        $item_div.attr('class', 'pacmanAI-ghostList-item');
      }
    });
  };

  onAdmittedChange = function (evnt) {
  };

  onTapAdd = function (evnt) {
    configMap.on_tap_add();
  };

  onTapAdmit = function (event) {
    var
      $orig_target = $(event.orig_target),
      name = $orig_target.attr('data-id'),
    if (name.length > 0) {
      configMap.ghosts_model.admit(name); 
    }
  };

  onTapList = function (event) {
    var
      $orig_target = $(event.orig_target),
      name = $orig_target.attr('data-id'),
      ghost = configMap.ghosts_model.get_by_name(name);

    if (ghost) {
      configMap.ghosts_model.set_selected([ghost]);
    }
  }

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
    jqueryMap.$list = $('.pacmanAI-ghostList-list').on('utap', onTapList);
    jqueryMap.$add = $('.pacmanAI-ghostList-add').on('utap', onTapAdd);
    jqueryMap.$delete = $('pacmanAI-ghostList-delete').on('utap', onTapDelete);
    $.gevent.subscribe(jqueryMap.$container, 'pacmanAI-listchange', onListChange);
    $.gevent.subscribe(jqueryMap.$container, 'selected-ghosts-changed', onSelectedChange);
    $.gevent.subscribe(jqueryMap.$container, 'admitted-ghosts-changed', onAdmittedChange);
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
