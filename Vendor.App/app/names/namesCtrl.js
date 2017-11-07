
    angular
        .module('app.names')
        .controller('names', names);

    names.$inject = ["$scope","namesResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify"];
    function names($scope,namesResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify) {

    $scope.names = [];
    $scope.dtInstance = {};
    $scope.name = {};


    $scope.getData = function () {
        var defer = $q.defer();
        if (!$scope.names.length) {
              namesResource.names.get().$promise.then(function (data) {
                console.log(JSON.parse(angular.toJson(data)))
                $scope.names = JSON.parse(angular.toJson(data)).data;
                defer.resolve($scope.names);
             });
        } else {
            setTimeout(function () {
                defer.resolve(JSON.parse(angular.toJson($scope.names)));
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
                { extend: 'copy', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [1] } },
                { extend: 'csv', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [1] } },
                { extend: 'excel', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [1] } },
                { extend: 'pdf', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { columns: [1] } },
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
         DTColumnBuilder.newColumn('name').renderWith(actionRender).withTitle('').notSortable()
         ];

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
        }


    function actionRender(data, type, full, meta) {

        return '<div class="btn-group">'+
                  '<button type="button" class="btn btn-primary btn-xs" ng-click="openEditForm('+ full.id +')" >Edit</button>'+
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
        $scope.name = {};
        $scope.showForm = true;
        $scope.formTitle = "Creating New Car Name";
     }

    $scope.openEditForm = function(id){
        $scope.name = {};

        $scope.names.map(function(name, key){
            if(name.id == id)
                $scope.name = name
        });
        $scope.showForm = true;
        $scope.formTitle = "Editing Car Name";
        document.getElementById('form').scrollIntoView();
     }

    $scope.cancelForm = function(){
        $scope.name = {};
        $scope.showForm = false;
        $scope.formTitle = "";
     }

    $scope.save = function(){

        if(!$scope.name.name ){
            //toaster.pop('error', "Notification", "Please, enter the car name !", 3000);
            notify({ message: "The name field is required", classes:'alert-danger',duration:5000} );
            //return;
        }

        if($scope.name.id){
            //Updating Record
            namesResource.names.update(angular.toJson($scope.name)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));

                console.log(response);

                $scope.names[$scope.names.getIndexOfObject('id',$scope.name.id)] =response
                toaster.pop('success', "Notification", "Name Updated !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm();
         },
         function(err){
                toaster.pop('error', "Notification", "Unable to Update !", 2000);
         });

        }else{
            //New Record
            namesResource.names.post(angular.toJson($scope.name)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));

                console.log(response);

                $scope.names.push(response);
                toaster.pop('success', "Notification", "New Car name Created !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm();
         },
         function(err){
            if(err.data.errors)
              parseErrors( err.data.errors)
            else
              toaster.pop('error', "Notification", "Unable to create file !", 2000);
         });
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
           namesResource.names.delete({id:id}).$promise.then(function (data) {
              console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Car Name Deleted!", 2000);
              $scope.names.splice($scope.names.getIndexOfObject('id',id),1)
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
