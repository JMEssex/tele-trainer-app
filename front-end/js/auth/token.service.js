(function () {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .factory(`tokenService`, tokenService);

  tokenService.$inject = [`$log`, `$window`];

  function tokenService($log, $window) {
    $log.info(`token service loaded!`);

    var SECRET_KEY = `dontbenaughtyandlookatthis`;
    var service = {
      store:    store,
      retrieve: retrieve,
      decode:   decode,
      destroy:  destroy
    };
    return service;

    function store(token) {
      $window.localStorage.setItem(SECRET_KEY, token);
      $log.info("token stored, local storage: ", $window.localStorage);
    }

    function retrieve() {
      return $window.localStorage.getItem(SECRET_KEY);
    }

    function decode() {
      return $window.jwt_decode(retrieve());
    }

    function destroy() {
      $window.localStorage.removeItem(SECRET_KEY);
      console.log("token destroyed, local storage: ", $window.localStorage);
    }
  }

})();
