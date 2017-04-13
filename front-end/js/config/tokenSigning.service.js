(function() {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .factory(`tokenSigningService`, tokenSigningService);

  tokenSigningService.$inject = [`$log`, `tokenService`];

  function tokenSigningService($log, tokenService) {
    return {
      request: signWithToken
    };

    function signWithToken(request) {
      if (tokenService.retrieve()) {
        $log.debug(`Token exists; signing request.`);
        request.headers["Authorization"] = `Bearer ${tokenService.retrieve()}`;
      }

      return request;
    }
  }

})();
