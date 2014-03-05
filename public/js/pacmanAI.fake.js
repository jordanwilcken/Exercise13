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

pacmanAI.fake = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {},
    stateMap  = {},
    jqueryMap = {},

    setJqueryMap, getGhostList;
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

  // Begin public method /getGhostList/
  // Purpose    : Gets a list of ghosts for testing purposes
  // Arguments  :
  // Returns    : A collection of ghosts
  // Throws     : none
  //
  getGhostList = function () {
    return [
      { name : 'Bill',
        strokeColor : 'red',
        fillColor : 'red'
      },
      {
        name : 'Tedd',
        strokeColor : 'blue',
        fillColor : 'red'
      },
      {
        name : 'Bonnie',
        strokeColor : 'pink',
        fillColor : 'black'
      },
      {
        name : 'Jill',
        strokeColor : 'pink',
        fillColor : 'yellow'
      }
    ];
  };
  // End public method /getGhostList/

  // return public methods
  return {
    getGhostList : getGhostList
  };
  //------------------- END PUBLIC METHODS ---------------------
}());
