var pacmanAI = (function () {
  'use strict';
	var initModule = function ($container) {
    pacmanAI.model.initModule();
    pacmanAI.shell.initModule($container);
  };
  return { initModule : initModule };
}());
