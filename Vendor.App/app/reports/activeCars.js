
    angular
        .module('app.reports')
        .controller('activeCars', activeCars);

    activeCars.$inject = ["$scope", "reportsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile"];
    function activeCars($scope, reportsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile) {

      var vm = this;

      vm.cars = [];
      vm.dtCarsInstance = {};
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

      vm.dtCarsIntanceCallback = function (instance) {
          vm.dtCarsInstance = instance;
       };


      vm.dtCarsOptions = DTOptionsBuilder
        .fromFnPromise(function () {
        var defer = $q.defer();

        reportsResource.reports.activeCars().$promise.then(function (data) {
          vm.cars = JSON.parse(angular.toJson(data));
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
        .withOption('initComplete',  initComplete)
        .withOption('footerCallback', footerCallback)
        .withDisplayLength(30)
            .withButtons([
                { extend: 'copy', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: {  } },
                { extend: 'csv', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: { } },
                { extend: 'excel', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: {  } },
                { extend: 'pdf', title: 'Baloo', filename: "Baloo", className: 'btn btn-sm btn-primary' ,exportOptions: {  } },
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


                        });
                    }
                },
                {
                    text: '<i class="fa fa-search" > </i>&nbsp;Search',
                    key: '1',
                    // className: 'btn-sm btn-primary',
                    action: function (e, dt, node, config) {
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
         DTColumnBuilder.newColumn('type').withTitle('Type'),
         DTColumnBuilder.newColumn('type').withTitle('Alert').renderWith(alertRender),
         DTColumnBuilder.newColumn('clientRentsDueAmount').withTitle('Due Amount/Rents').withClass('none'),
         DTColumnBuilder.newColumn('clientRepairsDueAmount').withTitle('Due Amount/Repairs').withClass('none'),
         // DTColumnBuilder.newColumn('revenueAfterSelling').withTitle('Net Revenue').withClass('none'),
       ];

      function alertRender(data, type, full, meta) {
        if(full.clientRentsDueAmount >  0 || full.clientRepairsDueAmount >  0 )
          return '<i class="fa fa-exclamation-circle text-danger"></i>';
      }

       function footerCallback( row, data, start, end, display ) {

            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };


            // Total overall 
            _totalDays = api
                .column( 4, {search:'applied'})
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            _totalCost = api
                .column( 5,{search:'applied'}) //apply to the filtered arrays
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            vm.totalDays = _totalDays;
            vm.totalCost = _totalCost;


            // current page total 
            currentDays= api
                .column( 4, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            currentCost = api
                .column( 5, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

                vm.currentDays = currentDays
                vm.currentCost = currentCost

                // $('#days').text(currentDays);
                // $('#cost').text(currentCost);

            

            // console.log(total,pageTotal)
        }

    function initComplete(settings, json) {
      $scope.$watch('[vm._search.brand,vm._search.name,vm._search.client,vm._search.plateNumber,vm._search.from,vm._search.to,vm._search.type]',function(){
          setTimeout(function () {
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

            if (vm._search.from && moment(vm._search.from).isValid() ) {
              if ( moment(aData[0]).isBefore(moment(vm._search.from)) ) {
                return false;
              }
            }

            if (vm._search.to && moment(vm._search.to).isValid() ) {
              if ( moment(aData[0]).isAfter(moment(vm._search.to)) ) {
                return false;
              }
            }

            return true;
          }
        );

        }

    };
