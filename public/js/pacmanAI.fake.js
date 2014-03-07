/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, pacmanAI, TAFFY */

pacmanAI.fake = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {},
    stateMap  = {},
    jqueryMap = {},

    setJqueryMap, getGhostList, mockSio;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // example: onClickButton = ...
  //-------------------- END EVENT HANDLERS --------------------

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

  mockSio = (function () {
    var
      emit, on,
      ghostTaffy = TAFFY(),
      callbackMap = {};
    
    emit = function (eventName, data) {
      if (eventName === 'addghost') {
        setTimeout(function () {
          ghostTaffy.insert(data);
          callbackMap.listchange([ghostTaffy().get()]);
        }, 1000); 
        return;
      }
      if (eventName ==='deleteghost') {
        setTimeout(function () {
          ghostTaffy({ name : data.name }).remove();
          callbackMap.listchange([ghostTaffy().get()]);
        }, 1000); 
        return;
      }
    };

    on = function (eventName, callback) {
      callbackMap[eventName] = callback;
    };

    return {
      emit : emit,
      on   : on
    };
  }());

  return {
    getGhostList : getGhostList,
    mockSio      : mockSio
  };
  //------------------- END PUBLIC METHODS ---------------------
}());
