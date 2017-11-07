
    angular
        .module('app.reports')
        .controller('activeCars', activeCars);

    activeCars.$inject = ["scope", "reportsResource", "DTOptionsBuilder", "DTColumnBuilder", "$q","$compile"];
    function activeCars(scope, reportsResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile) {

      var sc = this;

      sc.cars = [];
      sc.dtCarsInstance = {};

      sc.dtCarsIntanceCallback = function (instance) {
          sc.dtCarsInstance = instance;
       };


      sc.dtCarsOptions = DTOptionsBuilder
        .fromFnPromise(function () {
        var defer = $q.defer();

        reportsResource.reports.soldCars().$promise.then(function (data) {
          sc.cars = JSON.parse(angular.toJson(data)).data;
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
                }
            ]);

      sc.dtCarsColumns = [
         DTColumnBuilder.newColumn('name').withTitle('Name'),
         DTColumnBuilder.newColumn('plateNumber').withTitle('Plate #'),
         DTColumnBuilder.newColumn('purchasingDate').withTitle('Purchased at'),
         DTColumnBuilder.newColumn('sellingDate').withTitle('Sold at'),
         DTColumnBuilder.newColumn('totalRevenue').withTitle('Total Revenue'),
         DTColumnBuilder.newColumn('rentsRevenue').withTitle('Rents Revenue'),
         DTColumnBuilder.newColumn('rentsCount').withTitle('Rents count'),
         DTColumnBuilder.newColumn('repairsCost').withTitle('Repairs cost$'),
         DTColumnBuilder.newColumn('repairsCount').withTitle('Repairs Count'),
         DTColumnBuilder.newColumn('rentsDays').withTitle('Days'),
         DTColumnBuilder.newColumn('purchasingPrice').withTitle('Purchased Price $').withClass('none'),
         DTColumnBuilder.newColumn('sellingPrice').withTitle('Sold Price $').withClass('none'),
         DTColumnBuilder.newColumn('revenueAfterSelling').withTitle('Net Revenue').withClass('none'),
         DTColumnBuilder.newColumn('carKm').withTitle('Km').withClass('none'),
       ];

       function footerCallback( row, data, start, end, display ) {

            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            _totalRevenue = api
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

            _totalRentedDays = api
                .column( 9, {search:'applied'})
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            _totalNetRevenue = api
                .column( 12, {search:'applied'})
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

            sc.totalRevenue = _totalRevenue;
            sc.totalNetRevenue = _totalNetRevenue
            sc.totalRentedDays = _totalRentedDays
            sc.totalRentsRevenue = _totalRentsRevenue

            // console.log(total,pageTotal)
        }
    function initComplete(settings, json) {
         // $('.dataTables-example tfoot th').each( function (k) {
         //      var title = $(this).text();
         //      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
         //  } );

      $('.dataTables-example tfoot th').each( function (k,v) {
              console.log(k,v)
              // if(k == 4){
              //   var title = $(this).text();
              //   $(this).html( '<span type="text" id="totalRevenue" ></span>' );
              // }
          } );
      }

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())(scope);
        }

    };
