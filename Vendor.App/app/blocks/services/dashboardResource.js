(function () {
    "use strict";

    function dashboardResource($resource, __env) {

        return {
            instance: $resource(__env.BackendUrl + "/cars/", null,
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
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("dashboardResource", ["$resource", "__env", dashboardResource]);
}());

