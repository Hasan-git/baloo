
    angular
        .module('app.dashboard')
        .controller('dashboard', dashboard);

    dashboard.$inject = ["$scope", "carsResource", "$rootScope"];
    function dashboard($scope,carsResource,$rootScope) {

        $scope.range=false
        $scope.a ;
        $scope.b;
        $scope.rangeVar;
        $scope.cars = [];
        $scope.status ='';

        $scope.brands = [
                'mercedes',
                'audi',
                // 'volkswagen',
                'bmw',
                'opel',
                // 'porsche',
                // 'fiat',
                // 'alfa romeo',
                // 'maserati',
                // 'citroen',
                'renault',
                'peugeot',
                // 'land rover',
                'jeep',
                'chevrolet',
                'gmc',
                'ford',
                'honda',
                'toyota',
                'suzuki',
                'infiniti',
                'mazda',
                'nissan',
                'hyundai',
                'kia',
                'geely',
                'saipa',
                'chery'
          ];

        $scope.print = function(){
        var tr;
        var table =  angular.element('<table class="table table-striped  table-hover dataTables-example"><thead><tr><th>Car</th><th>Plate Number</th><th>Status</th></tr></thead></table>')
        for (var i = 0; i < $scope.filteredCars.length; i++) {
            tr = $('<tr/>');
            tr.append("<td>" + $scope.filteredCars[i].name + "</td>");
            tr.append("<td>" + $scope.filteredCars[i].plateNumber + "</td>");
            tr.append("<td>" + $scope.filteredCars[i].status + "</td>");
            $(table).append(tr);
        }
          $(table).print();
        }

      carsResource.cars.refreshCarsStatus().$promise.then(function(){
        carsResource.cars.get().$promise.then(function (data) {
                  var response = JSON.parse(angular.toJson(data)).data;

                  console.log(response);
                  response.map(function(car,key){
                    if(car.closestReserve){
                      response[key].closestReserve.dateOut = new Date(car.closestReserve.dateOut)
                      response[key].closestReserve.dateIn = new Date(car.closestReserve.dateIn)
                    }
                    if(car.currentRent){
                      response[key].currentRent.dateOut = new Date(car.currentRent.dateOut)
                      response[key].currentRent.dateIn = new Date(car.currentRent.dateIn)
                    }
                  })
                  $scope.cars = response;

           },
           function(err){
                  toaster.pop('error', "Notification", "Unable to load cars !", 3000);
           });
      });

      $scope.statusFn = function(a,b,c){
        if($scope.status != ''){
          var lowerStr = ($scope.status).toLowerCase();

          if($scope.status === 'available')
          return lowerStr.indexOf(a.status) === 0 || 'reserved'.indexOf(a.status) === 0 ? true : false;

          return lowerStr.indexOf(a.status) === 0 ? true : false;
          
        }else{
          return true
        }

      }

    $scope.startsWith = function (actual, expected) {
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
    }

    $scope.filterRange = function (actual) {
      if($scope.a && $scope.b ){
          var res= actual;
          var from = angular.copy($scope.a);
          var to = angular.copy($scope.b);

          if( !!actual.currentRent ){
            var checkRented =  moment(actual.currentRent.dateIn).isBetween(moment(from), moment(to), null, '[]')
                              || moment(actual.currentRent.dateOut).isBetween(moment(from), moment(to), null, '[]')
                              || moment(from).isBetween(moment(actual.currentRent.dateOut), moment(actual.currentRent.dateIn), null, '[]')
                              || moment(to).isBetween(moment(actual.currentRent.dateOut), moment(actual.currentRent.dateIn), null, '[]')

            if(checkRented){
              res = !res;
              return res;
            }
          }

          angular.forEach(actual.reservations, function(reservation, key) {

            res = moment(from).isBetween(moment(reservation.dateOut), moment(reservation.dateIn), null, '[]')
              || moment(to).isBetween(moment(reservation.dateOut), moment(reservation.dateIn), null, '[]')
              || moment(reservation.dateOut).isBetween(moment(from), moment(to), null, '[]')
              || moment(reservation.dateIn).isBetween(moment(from), moment(to), null, '[]')
              // || moment(actual.currentRent.dateIn).isBetween(moment(from), moment(to), null, '[]')
             ;
             res = !res;
          });

          return res;
        }else{
         return actual;
        }
      }


    // $scope.$watch('a',function(){
    //     $scope.rangeVar = $scope.a;
    // })


    $scope.gallery = function(event){
      event.preventDefault();
      event = event || window.event;
      var target = event.target || event.srcElement,
          link = target.src ? target.parentNode : target,
          options = {index: link, event: event};
          //var links = this.getElementsByTagName('a');
          var obj=[];
          $( ".links" ).each(function( index,v ) {
            var elements = v.getElementsByTagName('a')
            angular.forEach(elements, function(value, key){
              if($(value).attr("href") == $(event.currentTarget.children[0]).attr("href") &&  $(event.currentTarget.children[0]).attr("href") != ''){
               obj.unshift(value) ;
              }else if($(value).attr('href')){
                    obj.push(value) ;
                 }
              });
            });

      blueimp.Gallery(obj);
    }

    };
