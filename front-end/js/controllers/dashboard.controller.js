(function() {
  `use strict`;

  console.log("Loading Dashboard controller...")
  angular
    .module(`tele-trainer`)
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = [`$log`, `authService`];

  function DashboardController($log, authService) {
    var vm = this;

    vm.authService = authService;

    $log.info(`DashboardController loaded!`);
  }
}());
