(function () {
    "use strict";

    function repairsResource($resource, __env) {

        return {
            repairs: $resource(__env.BackendUrl + "/repairs/", null,
            {
                get: {
                    method: 'GET',
                    url: __env.BackendUrl + "/repairs/get",

                },
                getRepair: {
                    method: 'GET',
                    url: __env.BackendUrl + "/repairs/get/:id",
                    params: {
                        id: '@id'
                    }
                },
                getByCar: {
                    method: 'GET',
                    url: __env.BackendUrl + "/repairs/get/car/:id",
                    params: {
                        id: '@id'
                    }
                },
                post: {
                    method: 'POST',
                    url: __env.BackendUrl + "/repairs/post"
                },
                update: {
                    method: 'POST',
                    url: __env.BackendUrl + "/repairs/update"
                },
                delete: {
                    method: 'POST',
                    url: __env.BackendUrl + "/repairs/delete/:id",
                    params: {
                        id: '@id'
                    }
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("repairsResource", ["$resource", "__env", repairsResource]);
}());

