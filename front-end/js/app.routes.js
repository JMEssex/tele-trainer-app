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
      })
      .state(`signin`, {
        url: `/signin`,
        templateUrl: `/templates/signin.html`,
        controller: `SignInController`,
        controllerAs: `vm`
      })
      .state(`profile`, {
        url: `/profile`,
        templateUrl: `/templates/profile.html`
      });

    $urlRouterProvider.otherwise(`/`);
  }

})();
