/*
 * ghosts.js - module to provide ghost management
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $ */

'use strict';
//---------------- BEGIN MODULE SCOPE VARIABLES --------------
var
  emitGhostList, ghostsObj,
  socket  = require('socket.io'),
  crud    = require('./crud');
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS ------------------
emitGhostList = function (io) {
  crud.read (
    'ghost',
    {},
    {},
    function (list) {
      io
        .of('/ghosts')
        .emit('publish-ghost-list', list);
    }
  );
};
//-------------------- END UTILITY METHODS -------------------

//------------------- BEGIN EVENT HANDLERS -------------------
// example: onClickButton = ...
//-------------------- END EVENT HANDLERS --------------------



//------------------- BEGIN PUBLIC METHODS -------------------

ghostsObj = {
  connect : function (server) {
    var io = socket.listen(server);

    io
      .of('/ghosts')
      .on('connection', function (socket) {
        socket.on('addghost', function ( ghost_map ) {
          crud.read(
            'ghost',
            { name : ghost_map.name },
            {},
            function ( result_list) {
              if ( result_list !== null && result_list.length > 0 ) {
                socket.emit( 'error', {
                  error_message : String()
                    + 'There is already a ghost named '
                    + ghost_map.name
                    + ' in the list.'
                });
                return;
              }

              crud.construct(
                'ghost',
                ghost_map,
                function ( result_obj ) {
                  if ( undefined === result_obj.error_message ) {
                    crud.read(
                      'ghost',
                      {},
                      {},
                      function ( result_list ) {
                        io
                          .of( '/ghosts' )
                          .emit('listchange', result_list ); 
                      }
                    );
                  } else {
                    io
                      .of ('/ghosts')
                      .emit('error', result_obj.error_message);
                  }
                }
              );
            });
        });

        socket.on('deleteghost', function ( ghost_map ) {
          crud.destroy(
            'ghost',
            { name : ghost_map.name },
            function (result) {
              if (result.delete_count > 0) {
                emitGhostList(io);
              }
            }
          );
        });

        socket.on('ghosts-wanted', function () {
          emitGhostList(io);
        });
      }); 
  }
};

module.exports = ghostsObj;
//------------------- END PUBLIC METHODS ---------------------
