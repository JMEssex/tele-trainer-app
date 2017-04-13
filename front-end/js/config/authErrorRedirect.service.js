
(function() {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .factory(`authErrorRedirect`, authErrorRedirect);

  authErrorRedirect.$inject = [`$log`, `$q`];

  function authErrorRedirect($log, $q) {
    return {
      responseError: readStatusAndHandleAuthError
    };

    // In case you want to know why we want to do this: token
    // invalidation. If your token expires, or something else happens,
    // it's easiest to just ask the user to log in again to get a new
    // one!
    function readStatusAndHandleAuthError(err) {
      var status = err.status;

      // If you ever get a 401 or 403 (no authentication or
      // bad authorization) error, redirect to the sign in page.
      if (err.status === 401 || err.status === 403) {
        $log.debug(`${status} response received! Redirecting user to signin.`);
      }

      // Now that we've done our due diligence, pass the error through
      // to any controller-defined handlers. We could do this with:
      //
      // throw(err);
      //
      // … but returning a "rejected promise" to chain to is cleaner
      // than re-throwing the error. Note: $q is Angular's promise lib.
      return($q.reject(err));
    }
  }

})();
