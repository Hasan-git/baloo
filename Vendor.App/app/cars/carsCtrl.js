
    angular
        .module('app.cars')
        .controller('cars', cars);

    cars.$inject = ["$scope","carsResource","namesResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify", "FileUploader", "__env", "session"];
    function cars($scope, carsResource, namesResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify, FileUploader, __env, session) {

    $scope.cars = [];
    $scope.dtInstance = {};
    $scope.car = {};
    $scope.names = [];
    $scope.viewCar = {};
    $scope.soldCar = {};
    $scope.basUrl = __env.baseUrl;

    var uploader = $scope.uploader = new FileUploader({
            url: __env.BackendUrl + '/cars/post',
            queueLimit: 1,
            alias :"imagefile",
            headers: {
                'Authorization': 'Bearer ' + session.getAccessToken() // Inject Tokens
            }
        });

    uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1){
                  return true;
                }else{
                  notify({ message: "Only images are allowed", classes:'alert-danger',duration:4000} )
                  return false
                }
            }
        });

    uploader.onBeforeUploadItem = function(item) {
          var request= {};
          angular.copy($scope.car,request)
          request.officialMechanic = moment(new Date(request.officialMechanic)).format('YYYY-MM-DD')
          request.purchasingDate = moment(new Date(request.purchasingDate)).format('YYYY-MM-DD')

          //FormData Fixes -> issue null is converted to "null"
          angular.forEach(request, function(value, key) {
            if( typeof value === 'undefined' || typeof value === 'null')
              $scope.car[key] = ""
            });

         item.formData = [request] ;
      };

     uploader.onAfterAddingFile = function(fileItem) {
          $scope.car.image = "";
          fileItem.url = fileItem.url = __env.BackendUrl + '/cars/' + $scope.currentRequest;
        };

    var getNames = function(){
        var defer = $q.defer();
        namesResource.names.get().$promise.then(function(data){
          var response = JSON.parse(angular.toJson(data)).data;
          defer.resolve(response);
        },function(){
          defer.reject();
        });
          return defer.promise;
       }

    getNames().then(function(data){
        $scope.names = data;
        console.log("Names > ",$scope.names);
       })

    $scope.getData = function () {
      var defer = $q.defer();
      if (!$scope.cars.length) {
            carsResource.cars.get().$promise.then(function (data) {
              console.log(" Server > ",JSON.parse(angular.toJson(data)).data)
              $scope.cars = JSON.parse(angular.toJson(data)).data;
              defer.resolve($scope.cars);
           });
      } else {
          setTimeout(function () {
              defer.resolve(JSON.parse(angular.toJson($scope.cars)));
          }, 200);
      }
      return defer.promise;
     }


    $scope.dtOptions = DTOptionsBuilder
        .fromFnPromise(function () {
        var defer = $q.defer();

        $scope.getData().then(function (data) {
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
                { extend: 'copy', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3,4,5] } },
                { extend: 'csv', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3,4,5] } },
                { extend: 'excel', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3,4,5] } },
                { extend: 'pdf', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3,4,5] } },
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

                            $(this).find('td').css('text-align', 'left');
                            $(this).find('th').css('text-align', 'left');

                            $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                            $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();
                        });
                    }
                }
            ]);

    $scope.dtColumns = [
         DTColumnBuilder.newColumn('name').withTitle('Name'),
         DTColumnBuilder.newColumn('type').withTitle('Type'),
         DTColumnBuilder.newColumn('plateNumber').withTitle('Plate Number'),
         DTColumnBuilder.newColumn('model').withTitle('model'),
         DTColumnBuilder.newColumn('color').withTitle('color'),
         DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(statusRender),
         // DTColumnBuilder.newColumn('image').withTitle('image'),
         DTColumnBuilder.newColumn('name').renderWith(actionRender).withTitle('').notSortable()
         ];

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
        }


        function statusRender(data, type, full, meta) {
            var class_ = data == "available" ? 'primary' : 'danger' ;
            if( data == "available" ){
              class_ = 'primary';
            }else if( data == "reserved" ){
              class_ = 'warning';
            }else if( data == 'notavailable'){
              class_ = 'danger';
              data = "Not available"
            }
            else if( data == 'rented'){
              class_ = 'info';
            }
            else if( data == 'repair'){
              class_ = 'warning';
            }

        return '<div class="label label-'+class_+'">'+ data

                '</div>';
        }

    function actionRender(data, type, full, meta) {

        return '<div class="btn-group">'+
                  '<button type="button" class="btn btn-primary btn-xs" ng-click="detailsModal('+ full.id +')" >View</button>'+
                  '<button type="button" class="btn btn-primary btn-xs dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                   '<span class="caret"></span>'+
                  '</button>'+
                  '<ul class="dropdown-menu">'+
                    '<li class="dropdown-item" ><a href="" ui-sref="abstract.repairs({car_id:'+ full.id +'})" >Repairs</a></li>'+
                    '<li class="dropdown-item" ><a href="" ng-click="openEditForm('+ full.id +')" >Edit</a></li>'+
                    '<li class="dropdown-item" ><a href="" ng-click="carSoldModal('+ full.id +')" >Car Sold</a></li>'+
                    '<li class="dropdown-item" ><a href="" ng-click="deleteModal('+ full.id +')">Delete</a></li>'+
                  '</ul>'+
                '</div>';
        }

        $scope.dtIntanceCallback = function (instance) {
          $scope.dtInstance = instance;
         };


    $scope.openNewForm = function(){
      $scope.cancelForm($scope.form)
        $scope.car = {
          type:'sport',
          status:'available'
        };
        $scope.currentRequest = "post";
        $scope.showForm = true;
        $scope.formTitle = "Creating New Car";
      }

    $scope.openEditForm = function(id){
        $scope.cancelForm($scope.form)
        $scope.currentRequest = "update";
        $scope.cars.map(function(car, key){
            if(car.id == id)
              angular.copy(car, $scope.car)
        });
        $scope.car.purchasingDate = !$scope.car.purchasingDate ? '' : new Date($scope.car.purchasingDate) ;
        $scope.car.officialMechanic = !$scope.car.officialMechanic ? '' : new Date($scope.car.officialMechanic) ;
        $scope.showForm = true;
        $scope.formTitle = "Editing Car";
        $scope.scrollTo('#form');
     }

    $scope.cancelForm = function(form){
        $scope.car = {};
        $scope.showForm = false;
        $scope.formTitle = "";
        uploader.clearQueue();
        form.$setUntouched();
        form.$setPristine();
     }

    $scope.save = function(form){

      if(!form.$valid){
          angular.forEach($scope.form.$error, function (field) {
              angular.forEach(field, function(errorField){
                errorField.$setDirty();
              })
            });
          return
        }

        if($scope.car.id){
            //Updating Record
            if (uploader.queue[0]) {
                // uploader.url = __env.BackendUrl + '/cars/update'
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      //console.info('onCompleteItem', fileItem, response, status, headers,uploader);
                      if(status=== 200){
                        //var response = JSON.parse(angular.toJson(response));
                        console.log(response)
                        $scope.cars[$scope.cars.getIndexOfObject('id',$scope.car.id)] = response
                        toaster.pop('success', "Notification", "Car Updated !", 2000);
                        $scope.dtInstance.reloadData()
                        $scope.cancelForm(form);
                      }else{
                         parseErrors( response.errors)
                         fileItem.isUploaded= false;
                      }
                  };

            }else{
              carsResource.cars.update(angular.toJson($scope.car)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));
                $scope.cars[$scope.cars.getIndexOfObject('id',$scope.car.id)] =response
                toaster.pop('success', "Notification", "Car Updated !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm(form);
             },
             function(err){
                    toaster.pop('error', "Notification", "Unable to Update !", 2000);
             });
            }

        }else{
            //New Record
            if (uploader.queue[0]) {
                //uploader.url = __env.BackendUrl + '/cars/post';
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      console.info('onCompleteItem', fileItem, response, status, headers,uploader);
                      if(status=== 200){
                        $scope.cars.push(response);
                        toaster.pop('success', "Notification", "New Car Created !", 2000);
                        $scope.dtInstance.reloadData()
                        $scope.cancelForm(form);
                      }else{
                         parseErrors( response.errors)
                         //uploader.clearQueue();
                         fileItem.isUploaded= false;
                      }
                  };

            }else{
              carsResource.cars.post(angular.toJson($scope.car)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));
                $scope.cars.push(response);
                toaster.pop('success', "Notification", "New Car Created !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm(form);
           },
           function(err){
              if(err.data.errors)
                parseErrors( err.data.errors)
              else
                toaster.pop('error', "Notification", "Unable to create file !", 2000);
           });
          }
        }
     }

    $scope.deleteModal = function (id) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteCar.html',
            scope: $scope,
            size: 'lg',
        });


        $scope.yes = function () {
           carsResource.cars.delete({id:id}).$promise.then(function (data) {
              console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Car Deleted!", 2000);
              $scope.cars.splice($scope.cars.getIndexOfObject('id',id),1)
              $scope.dtInstance.reloadData()
              modalInstance.close();
         },
         function(err){
              if(err.data.errors)
                parseErrors( err.data.errors)
              else
                toaster.pop('error', "Notification", "Unable to delete Car  !", 2000);
         });
        };
        $scope.no = function () {
            modalInstance.dismiss('cancel');
        };
    }

    $scope.carSoldModal = function (id) {

        var car = $scope.cars[$scope.cars.getIndexOfObject('id',id)]
        // car.isSold = true;
        angular.copy(car,$scope.soldCar);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'carSoldModal.html',
            scope: $scope,
            size: 'lg',
        });

          $scope.yesSold = function () {
           carsResource.cars.carSold($scope.soldCar).$promise.then(function (data) {
              console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Car set as sold !", 2000);
              $scope.cars.splice($scope.cars.getIndexOfObject('id',id),1)
              $scope.dtInstance.reloadData()
              modalInstance.close();
         },
         function(err){
               if(err.data.errors)
                parseErrors( err.data.errors)
              else
                toaster.pop('error', "Notification", "Unable to perform this action !", 2000);
         });
        };
        $scope.noSold = function () {
            modalInstance.dismiss('cancel');
        };
    }

    $scope.detailsModal = function (id) {

        var car = $scope.cars[$scope.cars.getIndexOfObject('id',id)]

        angular.copy(car,$scope.viewCar);

        console.log(car,id);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'carDetails.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.dissmisViewCar = function () {
          $scope.viewCar = {};
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

    $scope.log = function() {
      console.log($scope.cars);

    }

    var appendFormdata = function (FormData, data, name){
    name = name || '';
    if (typeof data === 'object'){
        $.each(data, function(index, value){
            if (name == ''){
                appendFormdata(FormData, value, index);
            } else {
                appendFormdata(FormData, value, name + '['+index+']');
            }
        })
    } else {
        FormData.append(name, data);
    }
}

  };
