(function () {
    "use strict";

    function carsResource($resource, __env) {

        return {
            cars: $resource(__env.BackendUrl + "/cars/", null,
            {
                get: {
                    method: 'GET',
                    url: __env.BackendUrl + "/cars/get",
                },
                getById: {
                    method: 'GET',
                    url: __env.BackendUrl + "/cars/get/:id",
                    params: {
                        id: '@id'
                    }
                },
                post: {
                    method: 'POST',
                    url: __env.BackendUrl + "/cars/post"
                },
                carSold: {
                    method: 'POST',
                    url: __env.BackendUrl + "/cars/carSold"
                },
                update: {
                    method: 'POST',
                    url: __env.BackendUrl + "/cars/update"
                },
                delete: {
                    method: 'POST',
                    url: __env.BackendUrl + "/cars/delete/:id",
                    params: {
                        id: '@id'
                    }
                },
                refreshCarsStatus: {
                    method: 'POST',
                    url: __env.BackendUrl + "/cars/refreshCarsStatus"
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("carsResource", ["$resource", "__env", carsResource]);
}());

