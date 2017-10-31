
    angular
        .module('app.repairs')
        .controller('repairs', repairs);

    repairs.$inject = ["$scope","repairsResource", "clientsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify", "$stateParams", "FileUploader", "__env", "session"];
    function repairs($scope,repairsResource, clientsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify, $stateParams, FileUploader, __env, session) {

    $scope.dtInstance = {};
    $scope.repair = {};
    $scope.repairs = [];
    $scope.clients = [];
    $scope.viewClient = {};
    $scope.viewRepair = {};
    $scope.car_id = $stateParams.car_id;
    $scope.basUrl = __env.baseUrl;

    ///////////////////////////////////

    var uploader = $scope.uploader = new FileUploader({
            url: __env.BackendUrl + '/repairs/post',
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
          angular.copy($scope.repair,request)
          request.date = moment(new Date(request.date)).format('YYYY-MM-DD')
          request.completionDate = moment(new Date(request.completionDate)).format('YYYY-MM-DD')

          //FormData Fixes -> issue null is converted to "null"
          angular.forEach(request, function(value, key) {
            if( typeof value === 'undefined' || typeof value === 'null')
              $scope.repair[key] = ""
            });

         item.formData = [request] ;
      };


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

      //return all clients
      getClients().then(function(data){
        $scope.clients = data;
        console.log("Clients > ",$scope.clients);
       })

    $scope.getData = function () {
        var defer = $q.defer();
        if (!$scope.repairs.length) {
              repairsResource.repairs.getByCar({id:$scope.car_id}).$promise.then(function (data) {
                console.log(JSON.parse(angular.toJson(data)))
                $scope.repairs = JSON.parse(angular.toJson(data)).data;
                defer.resolve($scope.repairs);
             });
        } else {
            setTimeout(function () {
                defer.resolve(JSON.parse(angular.toJson($scope.repairs)));
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
                { extend: 'copy', title: 'Car Repairs', filename: "Car Repairs", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3] } },
                { extend: 'csv', title: 'Car Repairs', filename: "Car Repairs", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3] } },
                { extend: 'excel', title: 'Car Repairs', filename: "Car Repairs", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3] } },
                { extend: 'pdf', title: 'Car Repairs', filename: "Car Repairs", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [0,1,2,3] } },
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
         DTColumnBuilder.newColumn('client').withTitle('Client').renderWith(clientRender),
         DTColumnBuilder.newColumn('problem').withTitle('Problem'),
         DTColumnBuilder.newColumn('date').withTitle('Date'),
         DTColumnBuilder.newColumn('completionDate').withTitle('Finish Date'),
         DTColumnBuilder.newColumn('garage').withTitle('Garage'),
         DTColumnBuilder.newColumn('company').withTitle('Company'),
         DTColumnBuilder.newColumn('cost').withTitle('Cost'),
         DTColumnBuilder.newColumn('clientDueAmount').withTitle('Client Due Amount').renderWith(clientDueAmountRender),
         DTColumnBuilder.newColumn('isFinished').withTitle('IsFinished').renderWith(isFinishedRender),
         DTColumnBuilder.newColumn('problem').renderWith(actionRender).withTitle('').notSortable()
         ];

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
      }

      function clientDueAmountRender(data, type, full, meta) {
        if(parseInt(data) > 0 )
          return ' <strong class="text-danger"> <i class="fa fa-dollar"></i> '+data+'  </strong>';
        else
          return '</i><span class="text-muted"> <i class="fa fa-dollar"> 0 </span>';
      }

        function isFinishedRender(data, type, full, meta) {
        var class_  ;
        if( data == 1 ){
          data = "YES";
          class_ = 'primary';
        }else if( data == 0 ){
          class_ = 'danger';
          data = "NO";
        }
        return '<div class="label label-'+class_+'">'+ data

            '</div>';
    }

    function clientRender(data, type, full, meta) {
        if(data)
          return '<a ng-click="clientModal('+data.id+')">'+ data.name+' </a>';
        else
          return '<span class="text-danger"> No Client </span>';
      }

    function actionRender(data, type, full, meta) {

        return '<div class="btn-group">'+
                  '<button type="button" class="btn btn-primary btn-xs" ng-click="repairModal('+ full.id +')" >View</button>'+
                  '<button type="button" class="btn btn-primary btn-xs dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                   '<span class="caret"></span>'+
                  '</button>'+
                  '<ul class="dropdown-menu">'+
                    '<li class="dropdown-item" ><a href="" ng-click="openEditForm('+ full.id +')" >Edit</a></li>'+
                    '<li class="dropdown-item" ><a href="" ng-click="openEditForm('+ full.id +')" >Edit</a></li>'+
                   ' <li class="dropdown-item" ><a href="" ng-click="openModal('+ full.id +')">Delete</a></li>'+
                  '</ul>'+
                '</div>';
        }

        $scope.dtIntanceCallback = function (instance) {
          $scope.dtInstance = instance;
         };

    /*
    *
    * @ FUNC Form
    *
    */
    $scope.blurClientPayment = function (newValue) {
      // calculate DueAmount from ClientTotalCost -  clientPayment
       if( $scope.repair.clientPayment && $scope.repair.clientTotalCost &&
           $scope.repair.clientPayment < $scope.repair.clientTotalCost ){
          $scope.repair.clientDueAmount = parseInt( $scope.repair.clientTotalCost ) - parseInt( $scope.repair.clientPayment )
        }
    };

    $scope.openNewForm = function(){
        $scope.repair = {
          car_id: $scope.car_id,
          isFinished:false
        };
        $scope.currentRequest = "post";
        $scope.showForm = true;
        $scope.formTitle = "Creating New Repair Record";
        $scope.scrollTo('#form');
     }

    $scope.openEditForm = function(id){
        $scope.repair = {};

        $scope.repairs.map(function(repair, key){
            if(repair.id == id)
                angular.copy(repair, $scope.repair)
                //$scope.repair = repair
        });
        $scope.repair.date = new Date($scope.repair.date) ;
        $scope.repair.completionDate = new Date($scope.repair.completionDate);

        $scope.currentRequest = "update";
        $scope.showForm = true;
        $scope.formTitle = "Editing Repair Record";
        $scope.scrollTo('#form');
     }

    $scope.cancelForm = function(){
        $scope.repair = {};
        $scope.showForm = false;
        $scope.formTitle = "";
        uploader.clearQueue();
        $scope.form.$setUntouched();
        $scope.form.$setPristine();
     }

    $scope.save = function(){

        if(!$scope.form.$valid){
          angular.forEach($scope.form.$error, function (field) {
              angular.forEach(field, function(errorField){
                errorField.$setDirty();
                console.log(errorField)
              })
            });
          return
        }

        // estimating the isFinished attr
        if( !!$scope.repair.completionDate && moment ($scope.repair.completionDate).isSameOrBefore(moment())  )
              $scope.repair.isFinished = true;
            else
              $scope.repair.isFinished = false;

        if($scope.repair.id){
            //Updating Record

              if (uploader.queue[0]) {
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      //console.info('onCompleteItem', fileItem, response, status, headers,uploader);
                      if(status=== 200){
                        //var response = JSON.parse(angular.toJson(response));
                        console.log(response)
                        $scope.repairs[$scope.repairs.getIndexOfObject('id',$scope.repair.id)] = response
                        toaster.pop('success', "Notification", "Repair Updated !", 2000);
                        $scope.dtInstance.reloadData()
                        $scope.cancelForm();
                      }else{
                         parseErrors( response.errors)
                         fileItem.isUploaded= false;
                      }
                  };

            }else{
                repairsResource.repairs.update(angular.toJson($scope.repair)).$promise.then(function (data) {
                  var response = JSON.parse(angular.toJson(data));
                  $scope.repairs[$scope.repairs.getIndexOfObject('id',$scope.repair.id)] =response
                  toaster.pop('success', "Notification", "Record Updated !", 2000);
                  $scope.dtInstance.reloadData()
                  $scope.cancelForm();
               },
               function(err){
                      toaster.pop('error', "Notification", "Unable to Update !", 2000);
               });
            }

        }else {
            //New Record
            if (uploader.queue[0]) {
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      if(status=== 200){
                        $scope.repairs.push(response);
                        toaster.pop('success', "Notification", "New Repair Created !", 2000);
                        $scope.dtInstance.reloadData()
                        $scope.cancelForm();
                      }else{
                         parseErrors( response.errors)
                         //uploader.clearQueue();
                         fileItem.isUploaded= false;
                      }
                  };

            }
            else{
              repairsResource.repairs.post(angular.toJson($scope.repair)).$promise.then(function (data) {
                  var response = JSON.parse(angular.toJson(data));
                  $scope.repairs.push(response);
                  toaster.pop('success', "Notification", "New repair record created !", 2000);
                  $scope.dtInstance.reloadData()
                  $scope.cancelForm();
               },
               function(err){
                  if(err.data.errors)
                    parseErrors( err.data.errors)
                  else
                    toaster.pop('error', "Notification", "Unable to create this record !", 2000);
               });
            }
        }
     }

         $scope.openModal = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deletePatient.html',
            scope: $scope,
            size: 'lg',
        });


        $scope.yes = function () {
           repairsResource.repairs.delete({id:id}).$promise.then(function (data) {
              // console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Car Name Deleted!", 2000);
              $scope.repairs.splice($scope.repairs.getIndexOfObject('id',id),1)
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

    $scope.repairModal = function (id) {

        var repair = $scope.repairs[$scope.repairs.getIndexOfObject('id',id)]
        angular.copy(repair,$scope.viewRepair);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'repairModal.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.dismissClientModal = function () {
          $scope.viewRepair = {};
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
