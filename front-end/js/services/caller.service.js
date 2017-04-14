(function () {
  `use strict`;

  angular
    .module(`tele-trainer`)
    .factory(`callerService`, callerService);

  callerService.$inject = [`$log`, `$http`];

  function callerService($log, $http) {
    $log.info(`caller service loaded!`);

    var service = {
      create: create,
      logTranscription: logTranscription
    };
    return service;

    function create(data) {
      var promise = $http({
        method: `POST`,
        url:    `/api/callers`,
        data:   data,
        headers: {
          "Content-Type": "application/json" // JSON notation
        }
      });
      return promise;
    }

    function logTranscription(data, id) {
      console.log('data', data)
      console.log('id', id)
      var promise = $http({
        method: `POST`,
        url:    `/api/callers/${id}`,
        data:   data,
        headers: {
          "Content-Type": "application/json" // JSON notation
        }
      })
      return promise
    }

  }
})();
