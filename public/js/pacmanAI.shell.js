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

/*global $, ObjectThatDraws, Circle, pacmanAI */

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
        + '<div class="pacmanAI-shell-modal"></div>',
      create_ghost_html : String()
        + '<div class="pacmanAI-shell-modal-ghost-name">'
          + '<div class="pacmanAI-shell-modal-ghost-name-key pacmanAI-key">Name: </div>'
          + '<div class="pacmanAI-shell-modal-ghost-name-value pacmanAI-value"></div>'
        + '</div>'
        + '<div class="pacmanAI-shell-modal-ghost-strokeColor">'
          + '<div class="pacmanAI-shell-modal-ghost-strokeColor-key pacmanAI-key">Stroke Color: </div>'
          + '<div class="pacmanAI-shell-modal-ghost-strokeColor-value pacmanAI-value"></div>'
        + '</div>'
        + '<div class="pacmanAI-shell-modal-ghost-fillColor">'
          + '<div class="pacmanAI-shell-modal-ghost-fillColor-key pacmanAI-key">Fill Color: </div>'
          + '<div class="pacmanAI-shell-modal-ghost-fillColor-value pacmanAI-value"></div>'
        + '</div>'
        + '<canvas class="pacmanAI-shell-modal-ghost-preview" width="150" height="150"></canvas>'
        + '<div class="pacmanAI-shell-modal-buttons">'
          + '<div class="pacmanAI-shell-modal-add pacmanAI-button">Add</div>'
          + '<div class="pacmanAI-shell-modal-close pacmanAI-button">Close</div>'
        + '</div>'
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
      $modal     : $(".pacmanAI-shell-modal")
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /startGhostCreation/
  startGhostCreation = function () {
    var
      input_html,           on_value_click,       on_focusout,            circle,
      canvas,               draw_obj,             last_valid_strokeColor, potential_strokeColor,
      last_valid_fillColor, potential_fillColor,
      $modal_window = jqueryMap.$modal;

    $modal_window.html('<div class="pacmanAI-shell-modal-content"></div>');
    $('.pacmanAI-shell-modal-content').html(configMap.create_ghost_html);

    on_value_click = function (event) {
      var
        returned_elements, input_object_key, value_object_key,
        width;
      
      if (/name/.test(event.target.classList[0])) {
        input_object_key = '$name_input';
        value_object_key = '$name_value';
      } else if (/strokeColor/.test(event.target.classList[0])) {
        input_object_key = '$strokeColor_input';
        value_object_key = '$strokeColor_value';
      } else if (/fillColor/.test(event.target.classList[0])) {
        input_object_key = '$fillColor_input';
        value_object_key = '$fillColor_value';
      }

      width = jqueryMap[value_object_key].css('width');
      jqueryMap[input_object_key].css('width', width);
      returned_elements = jqueryMap[value_object_key].replaceWith(jqueryMap[input_object_key]);
      jqueryMap[input_object_key][0].setSelectionRange(0, jqueryMap[input_object_key].val().length);
      jqueryMap[value_object_key] = $(returned_elements)
        .click(on_value_click);
    };
    on_focusout = function () {
      var
        returned_elements, input_object_key, value_object_key,
        is_replacing_with_text = false;

      if (/name/.test(event.target.classList[0])) {
        is_replacing_with_text = true;
        input_object_key = '$name_input';
        value_object_key = '$name_value';
      } else if (/strokeColor/.test(event.target.classList[0])) {
        potential_strokeColor = jqueryMap.$strokeColor_input.val();
        if (pacmanAI.util.getIsLegitimateCssColor()) {
          jqueryMap.$strokeColor_value.css('background-color', jqueryMap.$strokeColor_input.val());
        } else {
          jqueryMap.$strokeColor_input.val(last_valid_strokeColor);
        }
        returned_elements = jqueryMap[input_object_key].replaceWith(jqueryMap[value_object_key]);
        jqueryMap[input_object_key] = $(returned_elements)
          .focusout(on_focusout);
      } else if (/fillColor/.test(event.target.classList[0])) {
        input_object_key = '$fillColor_input';
        value_object_key = '$fillColor_value';
      }

      if (is_replacing_with_text) {
        jqueryMap[value_object_key].html(jqueryMap[input_object_key].val());
      } else {
        jqueryMap[value_object_key].css('background-color', jqueryMap[input_object_key].val());
      }
      returned_elements = jqueryMap[input_object_key].replaceWith(jqueryMap[value_object_key]);
      jqueryMap[input_object_key] = $(returned_elements)
        .focusout(on_focusout);
    };

    input_html = String()
        + '<input class="pacmanAI-shell-modal-ghost-name-input pacmanAI-value-input">'
        + '</input>';
    jqueryMap.$name_input = $(input_html)
      .focusout(on_focusout);
    jqueryMap.$name_value = $('.pacmanAI-shell-modal-ghost-name-value')
      .click(on_value_click)
      .height($('.pacmanAI-shell-modal-ghost-name').height());     //Keep the name_value div at a good height

    input_html = String()
        + '<input class="pacmanAI-shell-modal-ghost-strokeColor-input pacmanAI-value-input">'
        + '</input>';
    jqueryMap.$strokeColor_input = $(input_html)
      .focusout(on_focusout);
    last_valid_strokeColor = 'black';
    jqueryMap.$strokeColor_value = $('.pacmanAI-shell-modal-ghost-strokeColor-value')
      .click(on_value_click)
      .height($('.pacmanAI-shell-modal-ghost-strokeColor').height())      //Keep the strokeColor_value div at a good height
      .css('background-color', last_valid_strokeColor);

    input_html = String()
        + '<input class="pacmanAI-shell-modal-ghost-fillColor-input pacmanAI-value-input">'
        + '</input>';
    jqueryMap.$fillColor_input = $(input_html)
      .focusout(on_focusout);
    last_valid_fillColor = 'red';
    jqueryMap.$fillColor_value = $('.pacmanAI-shell-modal-ghost-fillColor-value')
      .click(on_value_click)
      .height($('.pacmanAI-shell-modal-ghost-fillColor').height())      //Keep the fillColor_value div at a good height
      .css('background-color', last_valid_fillColor);


    $('.pacmanAI-shell-modal-add').click(function() {
      var
      ghosts, strokeColor, fillColor,
      name = $('.pacmanAI-shell-modal-ghost-name-value').html();

      if (name.length === 0) {
        alert('Your ghost needs a name.');
        return;
      }
      ghosts = pacmanAI.model.ghosts;
      if (ghosts.get_taffy()( { name : name } ).first()) {
        alert('Sorry, that name is taken.');
        return;
      }

      ghosts.add(pacmanAI.model.ghostFactory.makeGhost( { 
          name        : name,
          strokeColor : strokeColor,
          fillColor   : fillColor 
        })
      );
    });

    $(".pacmanAI-shell-modal-close").click(function() {
        $modal_window.css("visibility", "hidden");
        $modal_window.empty();
        delete jqueryMap.$name_value;
        delete jqueryMap.$name_input;
        delete jqueryMap.$strokeColor_value;
        delete jqueryMap.$strokeColor_input;
        delete jqueryMap.$fillColor_value;
        delete jqueryMap.$fillColor_input;
    });

    $modal_window.css("visibility", "visible");

    canvas = $('.pacmanAI-shell-modal-ghost-preview')[0];
    draw_obj = new ObjectThatDraws([canvas]);
    circle = new Circle({ X : canvas.width/2, Y : canvas.height/2 }, 0.45 * canvas.width);
    draw_obj.DrawFilledCircle(
      circle,
      jqueryMap.$strokeColor_value.css('background-color'),
      jqueryMap.$fillColor_value.css('background-color')
    );

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
    $container.html(configMap.main_html);
    setJqueryMap();

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
