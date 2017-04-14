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
    vm.submitCallerTranscription = submitCallerTranscription;
    vm.endCall = endCall;

    ///// *** FUNCTIONS *** /////
    function submitCaller() {
      callerService
        .create(vm.currentCaller)
        .then(function(res) {
          // On Success:
          vm.currentCaller = res.data
          res.preventDefault
          $log.info(`Sucessful Caller Created:`, res);
          vm.toggleCurrentCaller = !vm.toggleCurrentCaller
          },
          // On Error:
          function(err) {
            $log.info(`Errorfier Clarifier:`, err)
          }
        );

      $log.info(`DashboardController loaded!`);
    }

    function submitCallerTranscription() {
      callerService
        .logTranscription({callLog: vm.currentCaller.callLog}, vm.currentCaller._id)
        .then(function(res) {
          // On Success:
          res.preventDefault
          $log.info(`Call Transcription:`, res);
          },
          // On Error:
          function(err) {
            $log.info(`Errorfier Clarifier:`, err)
          }
        );
    }

    function endCall() {
      callerService
        .logTranscription({callLog: vm.currentCaller.callLog}, vm.currentCaller._id)
        .then(function(res) {
          // On Success:
          vm.currentCaller = {name: ``}
          vm.toggleCurrentCaller = !vm.toggleCurrentCaller
          $log.info(`Call Ended, Transcription Saved:`, res);
          },
          // On Error:
          function(err) {
            $log.info(`Errorfier Clarifier:`, err)
          }
        );
    }
  }

})();
