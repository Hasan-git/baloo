(function () {
    "use strict";

    function reportsResource($resource, __env) {

        return {
            reports: $resource(__env.BackendUrl + "/alerts/", null,
            {
                cars: {
                    method: 'GET',
                    url: __env.BackendUrl + "/reports/cars",
                },
                soldCars: {
                    method: 'GET',
                    url: __env.BackendUrl + "/reports/soldCars",
                },
                carsStituations: {
                    method: 'POST',
                    url: __env.BackendUrl + "/reports/carsStituations"
                }
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("reportsResource", ["$resource", "__env", reportsResource]);
}());

