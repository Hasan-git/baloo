
    angular
        .module('app.clients')
        .controller('clients', clients);

    clients.$inject = ["$scope","clientsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify", "FileUploader", "__env", "session"];
    function clients($scope, clientsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify, FileUploader, __env, session) {

    $scope.clients = [];
    $scope.dtInstance = {};
    $scope.client = {};
    $scope.viewClient = {};
    $scope.basUrl = __env.baseUrl;
    $scope.image;

    var uploader = $scope.uploader = new FileUploader({
            url: __env.BackendUrl + '/clients/post',
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
          angular.copy($scope.client,request)
          request.dob = moment(new Date(request.dob)).format('YYYY-MM-DD')
          request.licenseIssueDate = moment(new Date(request.licenseIssueDate)).format('YYYY-MM-DD')
          request.licenseExpiryDate = moment(new Date(request.licenseExpiryDate)).format('YYYY-MM-DD')

          //FormData Fixes -> issue null is converted to "null"
          angular.forEach(request, function(value, key) {
            if( typeof value === 'undefined' || typeof value === 'null')
              $scope.client[key] = ""
            });

            item.formData = [request] ;
        };

     uploader.onAfterAddingFile = function(fileItem) {

          console.log(fileItem,$scope.image)

          // $scope.client.image = "";
          fileItem.url = fileItem.url = __env.BackendUrl + '/clients/' + $scope.currentRequest;
        };

    $scope.getData = function () {
      var defer = $q.defer();
      if (!$scope.clients.length) {
            clientsResource.clients.get().$promise.then(function (data) {
              console.log(" Server > ",JSON.parse(angular.toJson(data)).data)
              $scope.clients = JSON.parse(angular.toJson(data)).data;
              defer.resolve($scope.clients);
           });
      } else {
          setTimeout(function () {
              defer.resolve(JSON.parse(angular.toJson($scope.clients)));
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
         DTColumnBuilder.newColumn('mother').withTitle('Mother'),
         DTColumnBuilder.newColumn('father').withTitle('Father'),
         DTColumnBuilder.newColumn('contactNumber').withTitle('contactNumber'),
         DTColumnBuilder.newColumn('dob').withTitle('Birthdate'),
         // DTColumnBuilder.newColumn('image').withTitle('image'),
         DTColumnBuilder.newColumn('name').renderWith(actionRender).withTitle('').notSortable()
         ];

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
        }

    function actionRender(data, type, full, meta) {

        return '<div class="btn-group">'+
                  '<button type="button" class="btn btn-primary btn-xs" ng-click="detailsModal('+ full.id +')" >View</button>'+
                  '<button type="button" class="btn btn-primary btn-xs dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                   '<span class="caret"></span>'+
                  '</button>'+
                  '<ul class="dropdown-menu">'+
                    '<li class="dropdown-item" ><a href="" ng-click="openEditForm('+ full.id +')" >Edit</a></li>'+
                   ' <li class="dropdown-item" ><a href="" ng-click="deleteModal('+ full.id +')">Delete</a></li>'+
                  '</ul>'+
                '</div>';
        }

        $scope.dtIntanceCallback = function (instance) {
          $scope.dtInstance = instance;
         };

    $scope.openNewForm = function(){
      $scope.cancelForm($scope.form)
        $scope.client = {};
        //update uploader url for posting
        $scope.currentRequest = "post";
        $scope.showForm = true;
        $scope.formTitle = "Creating New Client";
      }

    $scope.openEditForm = function(id){
        $scope.cancelForm($scope.form)
        //update uploader url for updating
        $scope.currentRequest = "update";
        $scope.clients.map(function(client, key){
            if(client.id == id)
              angular.copy(client, $scope.client)
        });
        $scope.client.dob = !$scope.client.dob ? '' : new Date($scope.client.dob) ;
        $scope.client.licenseIssueDate = !$scope.client.licenseIssueDate ? '' : new Date($scope.client.licenseIssueDate) ;
        $scope.client.licenseExpiryDate = !$scope.client.licenseExpiryDate ? '': new Date($scope.client.licenseExpiryDate);

        $scope.showForm = true;
        $scope.formTitle = "Editing Client";
        $scope.scrollTo('#form');
     }

    $scope.cancelForm = function(form){
        $scope.client = {};
        $scope.showForm = false;
        $scope.formTitle = "";
        uploader.clearQueue();
        form.$setUntouched();
        form.$setPristine();
     }

    $scope.save = function(form){

      if(!form.$valid){
          //Validate fields
          angular.forEach($scope.form.$error, function (field) {
              angular.forEach(field, function(errorField){
                errorField.$setDirty();
              })
            });
          return
        }

        if($scope.client.id){
            //Updating Record
            if (uploader.queue[0]) {
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      //console.info('onCompleteItem', fileItem, response, status, headers,uploader);
                      if(status=== 200){
                        var response = JSON.parse(angular.toJson(response));
                        console.log(response)
                        $scope.clients[$scope.clients.getIndexOfObject('id',$scope.client.id)] = response
                        toaster.pop('success', "Notification", "Car Updated !", 2000);
                        $scope.dtInstance.reloadData()
                        $scope.cancelForm(form);
                      }else{
                         parseErrors( response.errors)
                         fileItem.isUploaded= false;
                      }
                  };

            }else{
              clientsResource.clients.update(angular.toJson($scope.client)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));
                $scope.clients[$scope.clients.getIndexOfObject('id',$scope.client.id)] =response
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
                uploader.uploadAll()
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                      console.info('onCompleteItem', fileItem, response, status, headers,uploader);
                      if(status=== 200){
                        $scope.clients.push(response);
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
              clientsResource.clients.post(angular.toJson($scope.client)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));

                console.log(response);

                $scope.clients.push(response);
                toaster.pop('success', "Notification", "New Client Created !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm(form);
           },
           function(err){
              if(err.data.errors)
                parseErrors( err.data.errors)
              else
                toaster.pop('error', "Notification", "Unable to create client !", 3000);
           });
          }
        }
     }

    $scope.deleteModal = function (id) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteClient.html',
            scope: $scope,
            size: 'lg',
        });


        $scope.yes = function () {
           clientsResource.clients.delete({id:id}).$promise.then(function (data) {
              console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Car Name Deleted!", 2000);
              $scope.clients.splice($scope.clients.getIndexOfObject('id',id),1)
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

        var client = $scope.clients[$scope.clients.getIndexOfObject('id',id)]

        angular.copy(client,$scope.viewClient);


        console.log(client,id);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'clientDetails.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.dismissDetailsModal = function () {
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
