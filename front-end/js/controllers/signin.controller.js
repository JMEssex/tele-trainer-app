(function() {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .controller(`SignInController`, SignInController);

  SignInController.$inject = [`$log`, `authService`, `userService`, `$state`];

  function SignInController($log, authService, userService, $state) {
    var vm = this;

    ///// *** BINDINGS *** /////
    vm.signUp = {
      email:    ``,
      name:     ``,
      password: ``,
      passwordConfirmation: ``
    };
    vm.submitSignUp = submitSignUp;
    vm.logIn = {
      email:    ``,
      password: ``
    };
    vm.submitLogIn = submitLogIn;
    vm.conflict = false;

    ///// *** FUNCTIONS *** /////
    function submitSignUp() {
      userService
        .create(vm.signUp)
        .then(function(res) {
          return authService.logIn(vm.signUp);
        })
        .then(
          // On Success:
          function(decodedToken) {
            $log.info(`Logged in!`, decodedToken);
            $state.go(`dashboard`);
          },
          // On Error:
          function(err) {
            if (err.status === 409) vm.conflict = true;
            $log.info(`Errorfier Clarifier:`, err)
          }
        );
    }

    function submitLogIn() {
      authService
        .logIn(vm.logIn)
        .then(
          // on success
          function(decodedToken) {
            $log.info(`Logged in!`, decodedToken);
            $state.go(`dashboard`);
          },
          // on error
          function(err) {
            $log.info(`Error:`, err);
            vm.toggleValue = !vm.toggleValue;
          }
        );
    }

    $log.info(`SignInController loaded!`);
  }

})();

// XXX:
// BUG:
// IDEA:
// HACK:
// NOTE:
// TODO:
// FIXME:
// REVIEW:
// QUESTION:
