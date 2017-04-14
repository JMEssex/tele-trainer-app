(function () {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .factory(`tokenService`, tokenService);

  tokenService.$inject = [`$log`, `$window`];

  function tokenService($log, $window) {
    $log.info(`token service loaded!`);

    var TOKEN_KEY = `token`;
    var service = {
      store:    store,
      retrieve: retrieve,
      decode:   decode,
      destroy:  destroy
    };
    return service;

    function store(token) {
      $window.localStorage.setItem(TOKEN_KEY, token);
      $log.info("token stored, local storage: ", $window.localStorage);
    }

    function retrieve() {
      return $window.localStorage.getItem(TOKEN_KEY);
    }

    function decode() {
      return $window.jwt_decode(retrieve());
    }

    function destroy() {
      $window.localStorage.removeItem(TOKEN_KEY);
      console.log("token destroyed, local storage: ", $window.localStorage);
    }
  }

})();
