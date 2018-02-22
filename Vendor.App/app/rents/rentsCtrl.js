
    angular
        .module('app.rents')
        .controller('rents', rents);

    rents.$inject = ["$scope","rentsResource","carsResource","clientsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify","__env", "session", "$templateRequest", "$timeout",'resolvedParams'];
    function rents($scope, rentsResource, carsResource, clientsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify, __env, session, $templateRequest, $timeout,resolvedParams) {

      $scope.rents = [];
      $scope.dtInstance = {};
      $scope.rent = {};
      $scope.names = [];
      $scope.cars = [];
      $scope.clients = [];
      $scope.viewCar = {};
      $scope.viewRent = {};
      $scope.viewClient = {};
      $scope.carCard = {};
      $scope.clientCard = {};
      $scope.secondClientCard = {};
      $scope.basUrl = __env.baseUrl;
      $scope._rent = {};

      var onPageLoad = function(){
        // Open edit rent form
        if(resolvedParams.id && resolvedParams.action == 'received'){
          $scope.rents.map(function(rent, key){
              if(rent.id == resolvedParams.id){
                angular.copy(rent, $scope.rent)
                $scope.formTitle = "Editing Rent";
                $scope.showForm = true;
              }
          });
        }

        //open new rent form
        if(resolvedParams.id && resolvedParams.action ==  'new'){
          $scope.cars.map(function(car, key){
              if(car.id == resolvedParams.id){
                console.log(car)
                $scope.rent = {};
                var _car = {};
                angular.copy(car, _car)
                $scope.rent.car = _car;
                $scope.rent.car_id = _car.id
                $scope.formTitle = "Creating New Rent";
                $scope.showForm = true;
              }
          });
        }
    }

      $scope.label = "directive";

      $scope.print = function(id){
        rentsResource.rents.getById({id:id}).$promise.then(function (data) {
          var response = JSON.parse(angular.toJson(data));

          $scope._rent = angular.copy(response)
          $scope._rent.dateOut = new Date(response.dateOut)
          $scope._rent.dateIn = new Date(response.dateIn)

          $templateRequest("app/common/templates/printRent.html")
                .then(function(html) {
                  
                var elem = $compile(html)($scope);
                var parent = angular.element("<div></div>")
                parent.append(elem);

                  $timeout(function() {
                    parent.print()
                  }, 400); 

                });
        })
      }


      var getCars = function(){
        var defer = $q.defer();
        carsResource.cars.get().$promise.then(function(data){
          var response = JSON.parse(angular.toJson(data)).data;
          defer.resolve(response);
        },function(){
          defer.reject();
        });
          return defer.promise;
       }

      var getClients = function(){
        var defer = $q.defer();
        clientsResource.clients.get().$promise.then(function(data){
          var response = JSON.parse(angular.toJson(data)).data;
          defer.resolve(response);
        },function(){
          defer.reject();
        });
          return defer.promise;
       }

      //return all cars
      var cars = getCars().then(function(data){
        $scope.cars = data;
        console.log("Cars > ",$scope.cars);
       })

      //return all clients
     var clients =  getClients().then(function(data){
        $scope.clients = data;
        console.log("Clients > ",$scope.clients);
       })

    $scope.getData = function () {
      var defer = $q.defer();
      if (!$scope.rents.length) {
            rentsResource.rents.get().$promise.then(function (data) {
              //console.log(data)
              console.log(" Server > ",JSON.parse(angular.toJson(data)).data)
              $scope.rents = JSON.parse(angular.toJson(data)).data;
              defer.resolve($scope.rents);
           });
      } else {
          setTimeout(function () {
              defer.resolve(JSON.parse(angular.toJson($scope.rents)));
          }, 200);
      }
      return defer.promise;
     }

    $scope.dtOptions = DTOptionsBuilder
        .fromFnPromise(function () {
        var defer = $q.defer();

        $scope.getData().then(function (data) {
          $q.all([cars,clients]).then(function(a) {
              console.log("all promises loaded..");
              onPageLoad()
          });
            defer.resolve(JSON.parse(angular.toJson(data)));
        })

        return defer.promise;
        })
        //.newOptions()
        .withDOM('<"html5buttons text-right"B>lTfgtp<"bottom"i<"clear">>')
        //.withDOM('<"row"<"col-xs-4"l> <"col-xs-4"f> >Tgtp<"bottom"i<"clear">>')
        .withOption('lengthMenu', [10, 30, 50, 100, 150, 200])
        .withOption('createdRow', createdRow)
        .withDisplayLength(30)
            .withButtons([
                { extend: 'copy', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1] } },
                { extend: 'csv', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1] } },
                { extend: 'excel', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1] } },
                { extend: 'pdf', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1] } },
                {
                    extend: 'print',
                    className: 'btn btn-sm btn-primary' ,
                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                        $(win.document.body).find("tr").each(function () {

                            // $(this).find('td').css('text-align', 'left');
                            // $(this).find('th').css('text-align', 'left');

                            $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                            $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();
                        });
                    }
                }
            ]);

    $scope.dtColumns = [
         DTColumnBuilder.newColumn('car').withTitle('Car').renderWith(carRender),
         // DTColumnBuilder.newColumn('car.plateNumber').withTitle('Car Plate').renderWith(carRender),
         DTColumnBuilder.newColumn('client').withTitle('Client').renderWith(clientRender),
         DTColumnBuilder.newColumn('days').withTitle('Days'),
         DTColumnBuilder.newColumn('dateOut').withTitle('Out').renderWith(datetimeRender),
         DTColumnBuilder.newColumn('dateIn').withTitle('In').renderWith(datetimeRender),
         DTColumnBuilder.newColumn('costPerDay').withTitle('costPerDay'),
         DTColumnBuilder.newColumn('total').withTitle('total'),
         DTColumnBuilder.newColumn('dueAmount').withTitle('Amount Due').renderWith(dueAmountRender),
         DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(statusRender),
         // DTColumnBuilder.newColumn('image').withTitle('image'),
         DTColumnBuilder.newColumn('id').renderWith(actionRender).withTitle('').notSortable()
         ];

      function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
      }

      function datetimeRender(data, type, full, meta) {
        // return moment(new Date(data)).format('MMM D, YYYY h A')
        return moment(new Date(data)).format('D/M/YYYY h A')
      }

       function dueAmountRender(data, type, full, meta) {
        if(parseInt(data) > 0 )
          return ' <strong class="text-danger"> <i class="fa fa-dollar"></i> '+data+'  </strong>';
        else
          return '</i><span class="text-muted"> <i class="fa fa-dollar"> '+data+'  </span>';
      }

      function clientRender(data, type, full, meta) {
        if(data)
          return '<a ng-click="clientModal('+data.id+')">'+ data.name+' </a>';
        else
          return '<span class="text-danger"> No Client </span>';
      }

      function carRender(data, type, full, meta) {
         return '<a ng-click="carModal('+data.id+')">'+ data.name + ' - '+data.plateNumber+' </a>'
      }

      function statusRender(data, type, full, meta) {
          var class_  ;
          if( data == "in" ){
            class_ = 'primary';
          }else if( data == "reserved" ){
            class_ = 'warning';
          }else if( data == 'out'){
            class_ = 'danger';
          }

      return '<div class="label label-'+class_+'">'+ data

              '</div>';
      }


    function actionRender(data, type, full, meta) {

      //print-rent  -> directive for prenting
        return '<div class="btn-group">'+
                  '<button type="button" class="btn btn-primary btn-xs" ng-click="rentModal('+ full.id +')" >View</button>'+
                  '<button type="button" class="btn btn-primary btn-xs dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                   '<span class="caret"></span>'+
                  '</button>'+
                  '<ul class="dropdown-menu">'+
                    '<li class="dropdown-item" ><a href=""  ng-click="openEditForm('+ full.id +')" >Edit</a></li>'+
                    '<li class="dropdown-item" ><a href=""  rent-id="'+full.id+'" ng-click="print('+ full.id +')" >Print</a></li>'+
                    '<li class="dropdown-item" ><a href="" ng-click="deleteModal('+ full.id +')">Delete</a></li>'+
                  '</ul>'+
                '</div>';
        }

      $scope.dtIntanceCallback = function (instance) {
        $scope.dtInstance = instance;
       };

    /*
    *
    * @FORM FUNCTIONALITY
    *
    */
    var validate = function(compDate,propertyName){
      if(!!$scope.rent.car_id){
        var car ={reservations:{},currentRent:{}};

        //compare rent in & out with car current rent if exists
        car = $scope.cars[$scope.cars.getIndexOfObject('id',$scope.rent.car_id)];
        if(car && car.currentRent && $scope.rent.dateOut && $scope.rent.dateIn){        

          // In case of update check if rent id  is not the same of current rent if(thisRent != car.currentRent)
          if(car.currentRent.id == $scope.rent.id){
              return 0;
          }else{
              var currentRentDateOut = new Date(car.currentRent.dateOut);
              var currentRentDateIn = new Date(car.currentRent.dateIn);
              var dateOut  = new Date($scope.rent.dateOut);
              var dateIn  = new Date($scope.rent.dateIn);
              var r = moment(currentRentDateOut).isBetween(dateOut, dateIn, null, '[]') || moment(currentRentDateIn).isBetween(dateOut, dateIn, null, '[]')

              if(r){
                  //console.log("Alert..")
                  $scope.form[propertyName].$setValidity('carReserved', false)
                  return ;
                }
            }
          }

        // compare rent in & out with car reservations
        if(!!car && !!car.reservations){

          //By default its valid and check for invalidity below
          $scope.form[propertyName].$setValidity('carReserved', true)

          angular.forEach(car.reservations,function(reservation,key){
             var startDate = new Date(reservation.dateOut)
            , endDate   = new Date(reservation.dateIn)
            , date  = new Date(compDate);

            // In case of update check if rent id  is not the same of current reservation
            if(reservation.id == $scope.rent.id)
              return;

            if($scope.rent.dateOut && $scope.rent.dateIn){
              //check if any reservation goes between the new rent dateOut or dateIn
              var dateOut  = new Date($scope.rent.dateOut);
              var dateIn  = new Date($scope.rent.dateIn);

                res = moment(startDate).isBetween(dateOut, dateIn, null, '[]') || moment(endDate).isBetween(dateOut, dateIn, null, '[]')  ;

            }else{
              var res = moment(date).isBetween(startDate, endDate, null, '[]')  ;
            }

            if(res){
              $scope.form[propertyName].$setValidity('carReserved', false)
              return ;
            }
          })
        }
      }
    }

    $scope.$watch('[rent.car_id,rent.client_id]', function (newValue,oldValue) {

      //show car card
      if(!!$scope.rent.car_id){
        $scope.carCard={};
        var car = $scope.cars[$scope.cars.getIndexOfObject('id',$scope.rent.car_id)];
        if(car.closestReserve){
          car.closestReserve.dateOut = new Date(car.closestReserve.dateOut)
          car.closestReserve.dateIn = new Date(car.closestReserve.dateIn)
        }
        if(car.currentRent){
          car.currentRent.dateOut = new Date(car.currentRent.dateOut)
          car.currentRent.dateIn = new Date(car.currentRent.dateIn)
        }
        angular.copy(car, $scope.carCard);

        if(!!car && car.repairs.length){
          car.repairs.map(function(repair,k){
            if(!repair.isFinished){
              $scope.inRepairModal();
              return;
            }
          })
        }
      }

      // show Client card
      if(!!$scope.rent.client_id){
        $scope.clientCard={};
        var client = $scope.clients[$scope.clients.getIndexOfObject('id',$scope.rent.client_id)];
        angular.copy(client, $scope.clientCard);
      }

      //validate dateIn if conflicts with reservation or current rent
      if(!!$scope.rent.car_id && !!$scope.rent.dateIn ){
          validate($scope.rent.dateIn,'dateIn')
      }

      //validate dateOut if conflicts with reservation or current rent
      if(!!$scope.rent.car_id && !!$scope.rent.dateOut ){
          validate($scope.rent.dateOut,'dateOut')
      }

    });

    $scope.$watch('[rent.dateIn,rent.dateOut]', function (newValue,oldValue) {
      if(!!$scope.rent.dateIn && !!$scope.rent.dateOut){
        var diff = moment(new Date($scope.rent.dateIn)).diff(moment(new Date($scope.rent.dateOut)), 'days')
        if(diff>0)
          $scope.rent.days =  parseInt(diff)
      }

      if(!!$scope.rent.car_id && !!$scope.rent.dateIn ){
          validate($scope.rent.dateIn,'dateIn')
      }

      if(!!$scope.rent.car_id && !!$scope.rent.dateOut ){
          validate($scope.rent.dateOut,'dateOut')
      }
    });

    $scope.blurDays = function (newValue) {
      // calculate dateIn from days + date out
      if(!!newValue && !!$scope.rent.dateOut && newValue>0){
         $scope.rent.dateIn =  new Date(moment(new Date($scope.rent.dateOut)).add(parseInt(newValue), 'day'));
      }

      // calculate costPerDay from Total / days
      if(!!newValue && !!$scope.rent.total  ){
        var value  = ($scope.rent.total/newValue);
        $scope.rent.costPerDay =  parseInt(value) ;
      }
    };

    $scope.blurDailyCost = function (newValue) {
      // calculate total from dailyCost * days
      if(!!newValue && !!$scope.rent.days){
        $scope.rent.total = parseInt($scope.rent.costPerDay * $scope.rent.days);
      }
    };

    $scope.blurTotal = function (newValue) {
      // calculate dailyCost from total / days
      if(!!newValue && !!$scope.rent.days){
        var value  = (newValue / $scope.rent.days);
        $scope.rent.costPerDay =  parseInt(value);
      }
    };

    $scope.blurCash = function (newValue) {
      // calculate dueAmount from total - cash
      if(!!newValue && !!$scope.rent.total){
        var value  = ( $scope.rent.total - newValue);
        $scope.rent.dueAmount =  parseInt(value);
      }else if ( !!$scope.rent.total && newValue == 0){
        $scope.rent.dueAmount =  parseInt($scope.rent.total);
      }
    };

    $scope.blurKmIn = function (newValue) {
      // calculate dueAmount from total - cash
      if(!!newValue && !!$scope.rent.kmOut){
        var value  = (  newValue - $scope.rent.kmOut);
        $scope.rent.kmTotal =  parseInt(Math.abs(value));
      }
    };

    $scope.openNewForm = function(){
      $scope.cancelForm($scope.form)
        $scope.rent = {};
        $scope.showForm = true;
        $scope.formTitle = "Creating New Rent";
      }

    $scope.openEditForm = function(id){
        $scope.cancelForm($scope.form)
        $scope.rents.map(function(rent, key){
            if(rent.id == id)
              angular.copy(rent, $scope.rent)
        });
        $scope.rent.dateOut = new Date($scope.rent.dateOut)
        $scope.rent.dateIn = new Date($scope.rent.dateIn)
        $scope.showForm = true;
        $scope.formTitle = "Editing Rent";
        $scope.scrollTo('#form');
     }

    $scope.cancelForm = function(form){
        $scope.rent = {};
        $scope.showForm = false;
        $scope.formTitle = "";
        form.$setUntouched();
        form.$setPristine();
     }

    $scope.save = function(form,print){
      if(!form.$valid){
          toaster.pop('error', "Notification", "يوجد خطاء في البيانات المدخلة", 4000);
          angular.forEach($scope.form.$error, function (field) {
              angular.forEach(field, function(errorField){
                console.log(errorField)
                errorField.$setDirty();
              })
            });
          return
        }

        if($scope.rent.id){
            //Updating Record

              rentsResource.rents.update(angular.toJson($scope.rent)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));
                if(response.status == "in" && response.dueAmount == 0){
                  $scope.rents.splice($scope.rents.getIndexOfObject('id',$scope.rent.id), 1)
                }else{
                  $scope.rents[$scope.rents.getIndexOfObject('id',$scope.rent.id)] =response
                }
                toaster.pop('success', "Notification", "Car Updated !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm(form);
                //update all cars to avoid reservations conflicts
                getCars().then(function(data){
                  $scope.cars = data;
                 })

                if(!!print){
                  $scope.print(response.id)
                }

             },
             function(err){
                    toaster.pop('error', "Notification", "Unable to Update !", 2000);
             });

        }else{
            //New Record
              rentsResource.rents.post(angular.toJson($scope.rent)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));
                $scope.rents.push(response);
                toaster.pop('success', "Notification", "New Rent Created !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm(form);
                //update all cars to avoid reservations conflicts
                getCars().then(function(data){
                  $scope.cars = data;
                 })

                if(!!print){
                  $scope.print(response.id)
                }
           },
           function(err){
              if(err.data.errors)
                parseErrors( err.data.errors)
              else
                toaster.pop('error', "Notification", "Unable to create file !", 2000);
           });
        }
     }

    $scope.deleteModal = function (id) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteRent.html',
            scope: $scope,
            size: 'lg',
        });


        $scope.yes = function () {
           rentsResource.rents.delete({id:id}).$promise.then(function (data) {
              console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Rent deleted!", 2000);
              $scope.rents.splice($scope.rents.getIndexOfObject('id',id),1)
              $scope.dtInstance.reloadData()
              //update all cars to avoid reservations conflicts
              getCars().then(function(data){
                $scope.cars = data;
               })
              modalInstance.close();
         },
         function(err){
                toaster.pop('error', "Notification", "Unable to delete Rent !", 2000);
         });
        };
        $scope.no = function () {
            modalInstance.dismiss('cancel');
        };
    }

    $scope.inRepairModal = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'inRepairModal.html',
            scope: $scope,
            size: 'lg',
        });


        $scope.inRepairYes = function () {
              modalInstance.close();
        };
        $scope.inRepairNo = function () {
          $scope.rent.car_id = 0;
          modalInstance.dismiss('cancel');
        };
    }

    $scope.carModal = function (id) {

        var car = $scope.cars[$scope.cars.getIndexOfObject('id',id)]
        angular.copy(car,$scope.viewCar);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'carModal.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.dismissCarModal = function () {
          $scope.viewCar = {};
          modalInstance.dismiss('cancel');
        };
    }

      $scope.clientModal = function (id) {

        var client = $scope.clients[$scope.clients.getIndexOfObject('id',id)]
        angular.copy(client,$scope.viewClient);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'clientModal.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.dismissClientModal = function () {
          $scope.viewClient = {};
          modalInstance.dismiss('cancel');
        };
    }

    $scope.rentModal = function (id) {

      var rent = $scope.rents[$scope.rents.getIndexOfObject('id',id)]
      rent.dateOut = new Date(rent.dateOut);
      rent.dateIn = new Date(rent.dateIn);

      angular.copy(rent,$scope.viewRent);
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'rentModal.html',
          scope: $scope,
          size: 'lg',
      });

      $scope.dismissRentModal = function () {
        $scope.viewRent = {};
        modalInstance.dismiss('cancel');
      };
    }

    var parseErrors = function (response) {
        if (response) {
            angular.forEach(response, function(value, key) {
            var message = "";
              angular.forEach(value,function(v,k){
                notify({ message: v, classes:'alert-danger',duration:5000} );
              })
            });
        }
    };

  };

