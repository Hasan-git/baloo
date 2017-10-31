
    angular
        .module('app.alerts')
        .controller('alerts', alerts);

    alerts.$inject = ["$scope", "alertsResource"];
    function alerts($scope, alertsResource) {
      $scope.alerts = [];
      $scope.viewCar = {};
      $scope.viewRent = {};
      $scope.viewClient = {};
      $scope.endedRents = [];
      $scope.startedRents = [];
      $scope.officialMechanic = [];

       alertsResource.alerts.get().$promise.then(function(data){
          $scope.alerts = JSON.parse(angular.toJson(data))

          $scope.alerts.map(function(alert,key){
            if(alert.title == 'rent ends')
              $scope.endedRents.push(alert);

            else if(alert.title == 'rent starts')
              $scope.startedRents.push(alert);

            else if(alert.title == 'official mechanic')
              $scope.officialMechanic.push(alert);
          })
       });

       $scope.isCompleted = function(id,value,$index){
          alertsResource.alerts.updateStatus({id:id,isCompleted:value}).$promise.then(function(data){
            var response = JSON.parse(angular.toJson(data))
            $scope.$emit('updateAlerts');
          }),function(err){
          };
       }




    };
