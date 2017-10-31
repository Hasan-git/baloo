
    angular
        .module('app.carRents')
        .controller('carRents', carRents);

    carRents.$inject = ["$scope","carsResource","namesResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify", "FileUploader", "__env", "session"];
    function carRents($scope, carsResource, namesResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify, FileUploader, __env, session) {

    $scope.rents = [];
    $scope.dtInstance = {};
    $scope.rent = {};
    $scope.names = [];
    $scope.viewCar = {};
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
            //FormData Fixes -> issue null is converted to "null"
            angular.forEach($scope.rent, function(value, key) {
              if( typeof value === 'undefined' || typeof value === 'null')
                $scope.rent[key] = ""
              });

           item.formData = [$scope.rent] ;
        };

     uploader.onAfterAddingFile = function(fileItem) {
          $scope.rent.image = "";
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
      if (!$scope.rents.length) {
            carsResource.cars.get().$promise.then(function (data) {
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

                          // $(this).find('td:nth-child(1)').css('display', 'none').css('visibility', 'hidden').remove();
                          //   $(this).find('th::nth-child(1)').css('display', 'none').css('visibility', 'hidden').remove();

                          //   $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                          //   $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();

                          //   $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                          //   $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();

                          //   $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                          //   $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();
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
                    '<li class="dropdown-item" ><a href="" ng-click="openEditForm('+ full.id +')" >Edit</a></li>'+
                   ' <li class="dropdown-item" ><a href="" ng-click="openModal('+ full.id +')">Delete</a></li>'+
                  '</ul>'+
                '</div>';
        }

        $scope.dtIntanceCallback = function (instance) {
          $scope.dtInstance = instance;
         };


    $scope.openNewForm = function(){
      $scope.cancelForm($scope.form)
        $scope.rent = {
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
        $scope.rents.map(function(car, key){
            if(car.id == id)
              angular.copy(car, $scope.rent)
        });
        $scope.showForm = true;
        $scope.formTitle = "Editing Car";
        $scope.scrollTo('#form');
     }

    $scope.cancelForm = function(form){
        $scope.rent = {};
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

        if($scope.rent.id){
            //Updating Record
            if (uploader.queue[0]) {
                // uploader.url = __env.BackendUrl + '/cars/update'
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      //console.info('onCompleteItem', fileItem, response, status, headers,uploader);
                      if(status=== 200){
                        //var response = JSON.parse(angular.toJson(response));
                        console.log(response.data)
                        $scope.rents[$scope.rents.getIndexOfObject('id',$scope.rent.id)] = response.data
                        toaster.pop('success', "Notification", "Car Updated !", 2000);
                        $scope.dtInstance.reloadData()
                        $scope.cancelForm(form);
                      }else{
                         parseErrors( response.errors)
                         fileItem.isUploaded= false;
                      }
                  };

            }else{
              carsResource.cars.update(angular.toJson($scope.rent)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data)).data;
                $scope.rents[$scope.rents.getIndexOfObject('id',$scope.rent.id)] =response
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
                        $scope.rents.push(response.data);
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
              carsResource.cars.post(angular.toJson($scope.rent)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data)).data;

                console.log(response);

                $scope.rents.push(response);
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
              toaster.pop('success', "Notification", "Car Name Deleted!", 2000);
              $scope.rents.splice($scope.rents.getIndexOfObject('id',id),1)
              $scope.dtInstance.reloadData()
              modalInstance.close();
         },
         function(err){
                toaster.pop('error', "Notification", "Unable to delete Car Name !", 2000);
         });
        };
        $scope.no = function () {
            modalInstance.dismiss('cancel');
        };
    }

    $scope.detailsModal = function (id) {

        var car = $scope.rents[$scope.rents.getIndexOfObject('id',id)]

        angular.copy(car,$scope.viewCar);


        console.log(car,id);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'carDetails.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.dismiss = function () {
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
      console.log($scope.rents);

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
