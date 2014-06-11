var pacmanAI = (function () {
  'use strict';
	var initModule = function ($container) {
    pacmanAI.data.initModule();
    pacmanAI.model.initModule();
    pacmanAI.shell.initModule($container);
  };
  return { initModule : initModule };
}());
