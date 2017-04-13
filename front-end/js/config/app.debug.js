(function() {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .config(debug);

  debug.$inject = [`$logProvider`];

  function debug($logProvider) {
    // Set this to true to print $log.debug statements to the console.
    $logProvider.debugEnabled(true);
  }

})();
