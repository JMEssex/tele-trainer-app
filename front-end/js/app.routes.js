(function() {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .config(appRoutes);

  appRoutes.$inject = [`$urlRouterProvider`, `$stateProvider`];

  function appRoutes($urlRouterProvider, $stateProvider) {
    $stateProvider
      .state(`homepage`, {
        url: `/`,
        templateUrl: `/templates/homepage.html`
      });

    $urlRouterProvider.otherwise(`/`);
  }

})();
