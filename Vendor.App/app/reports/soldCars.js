
    angular
        .module('app.reports')
        .controller('soldCars', soldCars);

    soldCars.$inject = ["$scope", "reportsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile"];
    function soldCars($scope, reportsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile) {

      var sc = this;

      sc.cars = [];
      sc.dtCarsInstance = {};
      sc._search = {};

      sc.dtCarsIntanceCallback = function (instance) {
          sc.dtCarsInstance = instance;
       };

      sc.dtCarsOptions = DTOptionsBuilder
        .fromFnPromise(function () {
        var defer = $q.defer();

        reportsResource.reports.soldCars().$promise.then(function (data) {
          sc.cars = JSON.parse(angular.toJson(data)).data;
          console.log(sc.cars)
          defer.resolve(JSON.parse(angular.toJson(data)).data);
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
                        sc.search = !sc.search;
                        sc._search = {};
                    }
                }
            ]);


      sc.dtCarsColumns = [
         DTColumnBuilder.newColumn('name').withTitle('Name'),
         DTColumnBuilder.newColumn('plateNumber').withTitle('Plate #'),
         DTColumnBuilder.newColumn('purchasingDate').withTitle('Purchased at'),
         DTColumnBuilder.newColumn('sellingDate').withTitle('Sold at'),
         DTColumnBuilder.newColumn('revenueAfterSelling').withTitle('Net Profit').renderWith(currencyRender),
         DTColumnBuilder.newColumn('rentsRevenue').withTitle('Rents Revenue').renderWith(currencyRender),
         DTColumnBuilder.newColumn('rentsCount').withTitle('Rents count'),
         DTColumnBuilder.newColumn('repairsCost').withTitle('Repairs cost').renderWith(currencyRender),
         DTColumnBuilder.newColumn('repairsCount').withTitle('Repairs Count'),
         DTColumnBuilder.newColumn('rentsDays').withTitle('Days'),
         DTColumnBuilder.newColumn('purchasingPrice').withTitle('Purchased Price ').withClass('none').renderWith(currencyRender),
         DTColumnBuilder.newColumn('sellingPrice').withTitle('Sold Price').withClass('none').renderWith(currencyRender),
         DTColumnBuilder.newColumn('carKm').withTitle('Km').withClass('none'),
         DTColumnBuilder.newColumn('brand').withTitle('').notVisible(),
       ];

       function currencyRender(data, type, full, meta) {
          return '<span class=""> <i class="fa fa-dollar"></i> '+data+'  </span>';
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

            //Applied to all records 
            _totalNetProfit = api
                .column( 4,{search:'applied'}) //apply to the filtered arrays
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            _totalRentsRevenue = api
                .column( 5, {search:'applied'})
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            _totalRepairsCost = api
                .column( 7, {search:'applied'})
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            _totalRentedDays = api
                .column( 9, {search:'applied'})
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // current page total revenue
            currentTotalRevenue = api
                .column( 4, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // current page rents revenue
            currentRentsRevenue = api
                .column( 5, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // current page rents count
            currentRentsCount = api
                .column( 6, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // current page repairs cost
            currentRepairsCost = api
                .column( 7, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // current page repairs count
            currentRepairsCount = api
                .column( 8, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // current page days
            currentDays = api
                .column( 9, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

                $('#totalRevenue').text(currentTotalRevenue)
                $('#rentsRevenue').text(currentRentsRevenue)
                $('#rentsCount').text(currentRentsCount)
                $('#repairsCost').text(currentRepairsCost)
                $('#repairsCount').text(currentRepairsCount)
                $('#days').text(currentDays)

            sc.totalRepairsCost = _totalRepairsCost;
            sc.totalNetProfit = _totalNetProfit
            sc.totalRentedDays = _totalRentedDays
            sc.totalRentsRevenue = _totalRentsRevenue

            // console.log(total,pageTotal)
        }
    function initComplete(settings, json) {
         // $('.dataTables-example tfoot th').each( function (k) {
         //      var title = $(this).text();
         //      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
         //  } );
      $scope.$watch('[sc._search.purchaseDate,sc._search.soldDate,sc._search.name,sc._search.plateNumber,sc._search.brand]',function(){
          setTimeout(function () {
                      sc.dtCarsInstance.dataTable.fnDraw();
            }, 200);
        })
      }



    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
        }

        //Set default datatable buttons class
        $.fn.dataTable.Buttons.defaults.dom.button.className = 'btn btn-sm btn-success';

        $.fn.dataTableExt.afnFiltering.push(
          function(oSettings, aData, iDataIndex) {

            // if (typeof aData._date == 'undefined') {
            //   aData._date = new Date(aData[0]).getTime();
            // }

            if (sc._search.name) {
              if (aData[0].toLowerCase().indexOf(sc._search.name.toLowerCase()) <= -1) {
                return false;
              }
            }

            if (sc._search.plateNumber) {
              if (aData[1].toLowerCase().indexOf(sc._search.plateNumber.toLowerCase()) <= -1) {
                return false;
              }
            }

            if (sc._search.purchaseDate && moment(sc._search.purchaseDate).isValid() ) {
              console.log(moment(aData[2]).isAfter(moment(sc._search.purchaseDate)) , sc._search.purchaseDate)
              if ( moment(aData[2]).isBefore(moment(sc._search.purchaseDate)) ) {
                return false;
              }
            }

            if (sc._search.soldDate && moment(sc._search.soldDate).isValid() ) {
              if ( moment(aData[3]).isAfter(moment(sc._search.soldDate)) ) {
                return false;
              }
            }

            if (sc._search.brand) {
              if (aData[13].toLowerCase().indexOf(sc._search.brand.toLowerCase()) <= -1) {
                return false;
              }
            }

            // if (minDateFilter && !isNaN(minDateFilter)) {
            //   if (aData._date < minDateFilter) {
            //     return false;
            //   }
            // }

            // if (maxDateFilter && !isNaN(maxDateFilter)) {
            //   if (aData._date > maxDateFilter) {
            //     return false;
            //   }
            // }

            return true;
          }
        );

    };
