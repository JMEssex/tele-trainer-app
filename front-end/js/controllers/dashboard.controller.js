(function() {
  `use strict`;

  console.log("Loading Dashboard controller...")
  angular
    .module(`tele-trainer`)
    .controller(`DashboardController`, DashboardController);

  DashboardController.$inject = [`$log`, `authService`, `callerService`];

  function DashboardController($log, authService, callerService) {
    var vm = this;

    vm.authService = authService;

    ///// *** BINDINGS *** /////
    vm.currentCaller = {
      name: ``
    };
    
    vm.submitCaller = submitCaller;

    ///// *** FUNCTIONS *** /////
    function submitCaller() {
      callerService
        .create(vm.currentCaller)
        .then(function(res, e) {
          e.preventDefault
          console.log(`response`, res);
        })
        .then(
          // On Error:
          function(err) {
            $log.info(`Errorfier Clarifier:`, err)
          }
        );

    $log.info(`DashboardController loaded!`);
  }
}());
