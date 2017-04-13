(function () {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .factory(`userService`, userService);

  userService.$inject = [`$log`, `$http`];

  function userService($log, $http) {
    $log.info(`user service loaded!`);

    var service = {
      create: create
    };
    return service;

    function create(data) {
      var promise = $http({
        method: `POST`,
        url:    `/api/users`,
        data:   data
      });

      return promise;
    }
  }

})();
