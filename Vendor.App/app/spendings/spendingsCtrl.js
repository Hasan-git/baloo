
    angular
        .module('app.spendings')
        .controller('spendings', spendings);

    spendings.$inject =  ["$scope","spendingsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile","toaster","$uibModal","notify"];
    function spendings($scope,spendingsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $uibModal, notify) {

      $scope.spendings = [];
      $scope.dtInstance = {};
      $scope.spending = {};
      $scope.selectedMonth = ( moment().month()+1 ).toString();
      var dateChanged = false;


      $scope.getData = function () {
        var defer = $q.defer();
        if (!$scope.spendings.length || dateChanged) {
              spendingsResource.spendings.getByMonth({month:$scope.selectedMonth}).$promise.then(function (data) {
                console.log(JSON.parse(angular.toJson(data)))
                $scope.spendings = JSON.parse(angular.toJson(data)).data;
                dateChanged = false;
                defer.resolve($scope.spendings);
             });
        } else {
            setTimeout(function () {
                defer.resolve(JSON.parse(angular.toJson($scope.spendings)));
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
         DTColumnBuilder.newColumn('name').withTitle('Reason'),
         DTColumnBuilder.newColumn('date').withTitle('Date').renderWith(dateRender),
         DTColumnBuilder.newColumn('payment').withTitle('Payment'),
         DTColumnBuilder.newColumn('name').renderWith(actionRender).withTitle('').notSortable()
         ];

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
        }

    function dateRender(data, type, full, meta) {
      return moment(new Date(data)).format('dd-MM-YYYY')
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

          $scope.$watch('selectedMonth',function(){
            dateChanged = true;
            $scope.dtInstance.reloadData();
          })
         };


    $scope.openNewForm = function(){
        $scope.spending = {};
        $scope.spending.date = new Date();
        $scope.showForm = true;
        $scope.formTitle = "Creating New Record";
     }

    $scope.openEditForm = function(id){
        $scope.spending = {};
        $scope.spendings.map(function(val, key){
            if(val.id == id)
                $scope.spending = val
        });

        $scope.spending.date = new Date($scope.spending.date) ;
        $scope.showForm = true;
        $scope.formTitle = "Editing Record";
        $scope.scrollTo('#form');
     }

    $scope.cancelForm = function(){
        $scope.spending = {};
        $scope.showForm = false;
        $scope.formTitle = "";
     }

    $scope.save = function(){

        if(!$scope.spending.name ){
            notify({ message: "The reason field is required", classes:'alert-danger',duration:5000} );
            //return;
        }

        if($scope.spending.id){
            //Updating Record
            spendingsResource.spendings.update(angular.toJson($scope.spending)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));

                console.log(response);

                $scope.spendings[$scope.spendings.getIndexOfObject('id',$scope.spending.id)] =response
                toaster.pop('success', "Notification", "Record Updated !", 2000);
                $scope.dtInstance.reloadData()
                $scope.cancelForm();
         },
         function(err){
                toaster.pop('error', "Notification", "Unable to Update !", 2000);
         });

        }else{
            //New Record
            spendingsResource.spendings.post(angular.toJson($scope.spending)).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data));

                console.log(response);

                $scope.spendings.push(response);
                toaster.pop('success', "Notification", "New Spending Created !", 2000);
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
           spendingsResource.spendings.delete({id:id}).$promise.then(function (data) {
              console.log(JSON.parse(angular.toJson(data)))
              toaster.pop('success', "Notification", "Car Name Deleted!", 2000);
              $scope.spendings.splice($scope.spendings.getIndexOfObject('id',id),1)
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
