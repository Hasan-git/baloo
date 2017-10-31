(function () {
    "use strict";

    function rentsResource($resource, __env) {

        return {
            rents: $resource(__env.BackendUrl + "/rents/", null,
            {
                get: {
                    method: 'GET',
                    url: __env.BackendUrl + "/rents/get",
                },
                getById: {
                    method: 'GET',
                    url: __env.BackendUrl + "/rents/get/:id",
                    params: {
                        id: '@id'
                    }
                },
                post: {
                    method: 'POST',
                    url: __env.BackendUrl + "/rents/post"
                },
                update: {
                    method: 'POST',
                    url: __env.BackendUrl + "/rents/update"
                },
                delete: {
                    method: 'POST',
                    url: __env.BackendUrl + "/rents/delete/:id",
                    params: {
                        id: '@id'
                    }
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("rentsResource", ["$resource", "__env", rentsResource]);
}());

