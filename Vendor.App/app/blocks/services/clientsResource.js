(function () {
    "use strict";

    function clientsResource($resource, __env) {

        return {
            clients: $resource(__env.BackendUrl + "/clients/", null,
            {
                get: {
                    method: 'GET',
                    url: __env.BackendUrl + "/clients/get",
                },
                getById: {
                    method: 'GET',
                    url: __env.BackendUrl + "/clients/get/:id",
                    params: {
                        id: '@id'
                    }
                },
                post: {
                    method: 'POST',
                    url: __env.BackendUrl + "/clients/post"
                },
                update: {
                    method: 'POST',
                    url: __env.BackendUrl + "/clients/update"
                },
                delete: {
                    method: 'POST',
                    url: __env.BackendUrl + "/clients/delete/:id",
                    params: {
                        id: '@id'
                    }
                },
                getClientImages: {
                    method: 'get',
                    url: __env.BackendUrl + "/clients/getClientImages/:id",
                    params: {
                        id: '@id'
                    }
                },
                deleteClientImage: {
                    method: 'POST',
                    url: __env.BackendUrl + "/clients/deleteImage/:id",
                    params: {
                        id: '@id'
                    }
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("clientsResource", ["$resource", "__env", clientsResource]);
}());

