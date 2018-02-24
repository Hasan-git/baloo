angular
    .module('app.reports')
    .controller('activeCars', activeCars);

activeCars.$inject = ["$scope", "reportsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q", "$compile", "$uibModal", "rentsResource", "repairsResource",'toaster'];

function activeCars($scope, reportsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $uibModal, rentsResource, repairsResource,toaster) {

    var vm = this;

    vm.cars = [];
    vm.dtCarsInstance = {};
    $scope.viewRent = {};
    $scope.viewRepair = {};
    vm._search = {};
    vm.brands = [
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


    $scope.rentModal = function(id) {

        rentsResource.rents.getById({
            id: id
        }).$promise.then(function(data) {
            var rent = JSON.parse(angular.toJson(data));
            rent.dateOut = new Date(rent.dateOut);
            rent.dateIn = new Date(rent.dateIn);

            angular.copy(rent, $scope.viewRent);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rentModal.html',
                scope: $scope,
                size: 'lg',
            });

            $scope.deleteRent = function(id) {

                if (confirm("Do you want to delete this RENT ?")) {
                    rentsResource.rents.delete({id: id}).$promise.then(function(data) {
                        vm.cars.splice(vm.cars.getIndexOfObject('id', id), 1)
                        vm.dtCarsInstance.reloadData()
                        modalInstance.close();
                        toaster.pop('success', "Notification", "Deleted ", 2000);
                    },
                    function(err) {
                        toaster.pop('error', "Notification", "Unable to delete record !", 2000);
                    });
                } else {
                }
            }

        })
    }

    $scope.repairModal = function(id) {

        repairsResource.repairs.getRepair({
            id: id
        }).$promise.then(function(data) {
            var repair = JSON.parse(angular.toJson(data));
            console.log(repair)
            repair.completionDate = new Date(repair.completionDate);
            repair.date = new Date(repair.date);

            angular.copy(repair, $scope.viewRepair);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'repairModal.html',
                scope: $scope,
                size: 'lg',
            });


            $scope.deleteRepair = function(id) {

                if (confirm("Do you want to delete this REPAIR ?")) {
                    repairsResource.repairs.delete({id: id}).$promise.then(function(data) {
                            vm.cars.splice(vm.cars.getIndexOfObject('id', id), 1)
                            vm.dtCarsInstance.reloadData()
                            modalInstance.close();
                            toaster.pop('success', "Notification", "Deleted ", 2000);
                        },
                        function(err) {
                            toaster.pop('error', "Notification", "Unable to delete record !", 2000);
                    });
                }
                else{

                }
            }

        })
    }


    vm.dtCarsIntanceCallback = function(instance) {
        vm.dtCarsInstance = instance;
    };

    vm.dtCarsOptions = DTOptionsBuilder
        .fromFnPromise(function() {
            var defer = $q.defer();

            reportsResource.reports.activeCars().$promise.then(function(data) {
                vm.cars = JSON.parse(angular.toJson(data));
                console.log(vm.cars)
                defer.resolve(JSON.parse(angular.toJson(data)));
            });

            return defer.promise;
        })
        //.newOptions()
        .withDOM('<"html5buttons text-right"B>lTfgtp<"bottom"i<"clear">>')
        //.withDOM('<"row"<"col-xs-4"l> <"col-xs-4"f> >Tgtp<"bottom"i<"clear">>')
        .withOption('lengthMenu', [10, 30, 50, 100, 150, 200])
        .withOption('createdRow', createdRow)
        .withOption('responsive', true)
        .withOption('initComplete', initComplete)
        .withOption('footerCallback', footerCallback)
        .withDisplayLength(30)
        .withButtons([{
                extend: 'copy',
                title: 'Baloo',
                filename: "Baloo",
                className: 'btn btn-sm btn-primary',
                exportOptions: {}
            },
            {
                extend: 'csv',
                title: 'Baloo',
                filename: "Baloo",
                className: 'btn btn-sm btn-primary',
                exportOptions: {}
            },
            {
                extend: 'excel',
                title: 'Baloo',
                filename: "Baloo",
                className: 'btn btn-sm btn-primary',
                exportOptions: {}
            },
            {
                extend: 'pdf',
                title: 'Baloo',
                filename: "Baloo",
                className: 'btn btn-sm btn-primary',
                exportOptions: {}
            },
            {
                extend: 'print',
                className: 'btn btn-sm btn-primary',
                customize: function(win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');
                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                    $(win.document.body).find("tr").each(function() {


                    });
                }
            },
            {
                text: '<i class="fa fa-search" > </i>&nbsp;Search',
                key: '1',
                // className: 'btn-sm btn-primary',
                action: function(e, dt, node, config) {
                    vm.search = !vm.search;
                    vm._search = {};
                }
            }
        ]);



    vm.dtCarsColumns = [
        DTColumnBuilder.newColumn('date').withTitle('Date'),
        DTColumnBuilder.newColumn('carBrand').withTitle('Brand'),
        DTColumnBuilder.newColumn('carName').withTitle('Name'),
        DTColumnBuilder.newColumn('plateNumber').withTitle('plate #'),
        DTColumnBuilder.newColumn('days').withTitle('Days'),
        DTColumnBuilder.newColumn('cost').withTitle('Cost'),
        DTColumnBuilder.newColumn('client').withTitle('Client'),
        DTColumnBuilder.newColumn('type').renderWith(typeRender),
        DTColumnBuilder.newColumn('id').withTitle('Alert').renderWith(alertRender),
        DTColumnBuilder.newColumn('clientRentsDueAmount').withTitle('Due Amount/Rents').withClass('none'),
        DTColumnBuilder.newColumn('clientRepairsDueAmount').withTitle('Due Amount/Repairs').withClass('none'),
        // DTColumnBuilder.newColumn('revenueAfterSelling').withTitle('Net Revenue').withClass('none'),
    ];

    function alertRender(data, type, full, meta) {

        if (parseInt(full.clientRentsDueAmount) > 0 || parseInt(full.clientRepairsDueAmount) > 0)
            return '<i class="fa fa-exclamation-circle text-danger"></i>';
        else
            return '<i class="fa fa-check text-success"></i>';
    }

    function typeRender(data, type, full, meta) {
        if (data == "rent")
            return '<span class="pointer" ng-click="rentModal(' + full.id + ')"> Rent </span>';
        else
            return '<span class="pointer" ng-click="repairModal(' + full.id + ')"> Repair </span>';
    }

    function footerCallback(row, data, start, end, display) {

        var api = this.api(),
            data;

        // Remove the formatting to get integer data for summation
        var intVal = function(i) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                i : 0;
        };


        // Total overall 
        _totalDays = api
            .column(4, {
                search: 'applied'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        _totalCost = api
            .column(5, {
                search: 'applied'
            }) //apply to the filtered arrays
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        vm.totalDays = _totalDays;
        vm.totalCost = _totalCost;


        // current page total 
        currentDays = api
            .column(4, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        currentCost = api
            .column(5, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        vm.currentDays = currentDays
        vm.currentCost = currentCost
    }

    function initComplete(settings, json) {
        $scope.$watch('[vm._search.brand,vm._search.name,vm._search.client,vm._search.plateNumber,vm._search.from,vm._search.to,vm._search.type]', function() {
            setTimeout(function() {
                vm.dtCarsInstance.dataTable.fnDraw();
            }, 200);
        })
    }

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);

        //Set default datatable buttons class
        $.fn.dataTable.Buttons.defaults.dom.button.className = 'btn btn-sm btn-success';

        $.fn.dataTableExt.afnFiltering.push(
            function(oSettings, aData, iDataIndex) {

                // if (typeof aData._date == 'undefined') {
                //   aData._date = new Date(aData[0]).getTime();
                // }
                if (vm._search.brand) {
                    if (aData[1].toLowerCase().indexOf(vm._search.brand.toLowerCase()) <= -1) {
                        return false;
                    }
                }
                if (vm._search.name) {
                    if (aData[2].toLowerCase().indexOf(vm._search.name.toLowerCase()) <= -1) {
                        return false;
                    }
                }

                if (vm._search.plateNumber) {
                    if (aData[3].toLowerCase().indexOf(vm._search.plateNumber.toLowerCase()) <= -1) {
                        return false;
                    }
                }

                if (vm._search.client) {
                    if (aData[6].toLowerCase().indexOf(vm._search.client.toLowerCase()) <= -1) {
                        return false;
                    }
                }

                if (vm._search.type) {
                    if (aData[7].toLowerCase().indexOf(vm._search.type.toLowerCase()) <= -1) {
                        return false;
                    }
                }

                if (vm._search.from && moment(vm._search.from).isValid()) {
                    if (moment(aData[0]).isBefore(moment(vm._search.from))) {
                        return false;
                    }
                }

                if (vm._search.to && moment(vm._search.to).isValid()) {
                    if (moment(aData[0]).isAfter(moment(vm._search.to))) {
                        return false;
                    }
                }

                return true;
            }
        );

    }

};