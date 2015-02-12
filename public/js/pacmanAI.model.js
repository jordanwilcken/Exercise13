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

pacmanAI.model = (function () {
  'use strict';
  var
    ghosts, initModule, setisDataReal,
    isDataReal = true;

  // The ghosts object API
  // _____________________
  // The ghosts object provides methods and events to manage a collection
  // of ghost objects. Its public methods include:
  //  * get_selected() - returns a collection of the selected ghosts.
  //  * set_selected() - sets the collection of the selected ghosts.
  //  * get_taffy() - return a TaffyDB database of all person objects. Sorted.
  //  * get_by_name(name) - return the ghost with the provided unique id.
  //  * add(ghost) - adds a ghost. Returns a bool indicating success.
  //  * dlete(name) - deletes the ghost with the specified name.
  //  * admit(name) - admits the ghost with the specified name to the map.
  //  * eject(name) - removes the ghost with the specified name from the map.
  //
  //  Each ghost is represented by a ghost object.
  //  Ghost objects provide the following methods:
  //    * ChoosePath() - makes the ghost choose a path to traverse
  //    * get_Map(map)
  //    * set_Map(map) - sets the map the ghost will use for pathfinding
  //    * Draw() - makes the ghost draw itself
  //    * FollowPath(path, distance) - makes the ghost move the specified distance
  //      along the specified path.
  //    * observeEnemy(object) - provides the ghost with data with data about 
  //      enemies. So the ghost can interact with them.
  //    * Position(point?) - gets or sets position
  //    * ResolveTimePassing(timeSpan)
  //
  //  The attributes for a ghost object include:
  //    * name - the name of the ghost
  //    * strokeColor - used to draw outline of ghost
  //    * fillColor - used to fill the ghost
  ghosts = (function () {
    var
      get_selected, get_db, get_by_name, _update_list,
      _on_listchange, set_selected, get_taffy,
      add, dlete, admit, eject,
      sio = isDataReal ? pacmanAI.data.getSio() : pacmanAI.fake.mockSio,
      stateMap = {
        selected_ghosts : [],
        admitted_ghosts : [],
        ghosts_taffy    : TAFFY()
      };

    get_selected = function() {
      return stateMap.selected_ghosts;
    };

    set_selected = function(ghosts) {
      var
        j, k, alreadySelected,
        currentlySelected = stateMap.selected_ghosts,
        validSelections = [];

      ghosts.forEach(function (ghost, idx) {
        if (stateMap.ghosts_taffy({ name : ghost.name }).count() > 0) {
          validSelections.push(ghost);
        }
      });

      if (validSelections.length !== currentlySelected.length) {
        stateMap.selected_ghosts = validSelections;
        $.gevent.publish('selected-ghosts-changed', stateMap.selected_ghosts);
        return;
      }
      for (j = 0; j < validSelections.length; ++j) {
        alreadySelected = false;
        for (k = 0;k < currentlySelected.length; ++k) {
          if (validSelections[j].name === currentlySelected[k].name) {
            alreadySelected = true;
          } 
        }
        if (!alreadySelected) {
          stateMap.selected_ghosts = validSelections;
          $.gevent.publish('selected-ghosts-changed', stateMap.selected_ghosts);
          return;
        }
      }
    };

    get_taffy = function() {
      return stateMap.ghosts_taffy;
    };

    get_by_name = function(name) {
      return stateMap.ghosts_taffy({name : name}).first();  
    };

    add = function(ghost) {
      var sio = isDataReal ? pacmanAI.data.getSio() : pacmanAI.fake.mockSio;
      sio.emit( 'addghost', {
        name : ghost.name,
        strokeColor : ghost.strokeColor,
        fillColor : ghost.fillColor
      });
    };

    dlete = function(name) {
      var sio = isDataReal ? pacmanAI.data.getSio() : pacmanAI.fake.mockSio;
      sio.emit( 'deleteghost', {
        name : name
      });
    };

    admit = function(name) {
      var
        j,
        admitted_ghosts = stateMap.admitted_ghosts;

      for (j = 0; j < admitted_ghosts.length; ++j) {
        if (admitted_ghosts[j].name === name) {
          return;
        }
      } 

      admitted_ghosts.push(stateMap.ghosts_taffy({ name : name }).first());
      $.gevent.publish('admitted-ghosts-changed', [admitted_ghosts]);
    };

    eject = function(name) {
      var
        j,
        admitted_ghosts = stateMap.admitted_ghosts;

      for (j = 0; j < admitted_ghosts.length; ++j) {
        if (admitted_ghosts[j].name === name) {
          admitted_ghosts.splice(j, 1);
          $.gevent.publish('admitted-ghosts-changed', [admitted_ghosts]);
          return;
        }
      }
    };

    _update_list = function (arg_list) {
      var
        j, ghost_map, make_ghost_map, theGhost,
        ghost_list = arg_list[0],
        admitted_ghosts = stateMap.admitted_ghosts;

      stateMap.ghosts_taffy = TAFFY();

      for (j = 0; j < ghost_list.length; ++j) {
        ghost_map = ghost_list[j];
        make_ghost_map = {
          name : ghost_map.name,
          strokeColor : ghost_map.strokeColor,
          fillColor   : ghost_map.fillColor
        };
        theGhost = pacmanAI.model.ghostFactory.makeGhost(make_ghost_map);
        stateMap.ghosts_taffy.insert(theGhost);
      }
      
      for (j = 0; j < admitted_ghosts.length; ++j) {
        if (!stateMap.ghosts_taffy({ name : admitted_ghosts[j].name}).first()) {
          admitted_ghosts.splice(j, 1);
          $.gevent.publish('admitted-ghosts-changed', admitted_ghosts);
        }
      }
    };

    _on_listchange = function (arg_list)
    {
      _update_list(arg_list);
      $.gevent.publish('pacmanAI-listchange', arg_list);
      set_selected(stateMap.selected_ghosts);
    };
    sio.on('listchange', _on_listchange);
    sio.on('publish-ghost-list', _on_listchange);

    return {
      get_selected : get_selected,
      set_selected : set_selected,
      get_taffy : get_taffy,
      get_by_name : get_by_name,
      add : add,
      dlete : dlete,
      admit : admit,
      eject : eject
    };
  }());


  initModule = function () {
    var
      ghost_list, j, ghost_map, theGhost,
      sio = isDataReal ? pacmanAI.data.getSio() : pacmanAI.fake.mockSio;
    if (!isDataReal)
    {
      ghost_list = pacmanAI.fake.getGhostList();
      for (j = 0; j < ghost_list.length; ++j) {
        ghost_map = ghost_list[j];
        theGhost = pacmanAI.model.ghostFactory.makeGhost({
          name   : ghost_map.name,
          strokeColor : ghost_map.strokeColor,
          fillColor : ghost_map.fillColor
        });
        ghosts.add(theGhost);
      }
    } else {
      sio.emit('ghosts-wanted');
    }
  };

  setisDataReal = function (real) {
    isDataReal = real;
  };

  return { 
    initModule : initModule,
    setisDataReal : setisDataReal,
    ghosts : ghosts
  };
}());
