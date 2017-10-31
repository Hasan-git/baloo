(function () {
    "use strict";

    function namesResource($resource, __env) {

        return {
            names: $resource(__env.BackendUrl + "/users/", null,
            {
                get: {
                    method: 'GET',
                    url: __env.BackendUrl + "/names/get",

                },
                getName: {
                    method: 'GET',
                    url: __env.BackendUrl + "/names/get/:name",
                    params: {
                        name: '@name'
                    }
                },
                post: {
                    method: 'POST',
                    url: __env.BackendUrl + "/names/post"
                },
                update: {
                    method: 'POST',
                    url: __env.BackendUrl + "/names/update"
                },
                delete: {
                    method: 'POST',
                    url: __env.BackendUrl + "/names/delete/:id",
                    params: {
                        id: '@id'
                    }
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("namesResource", ["$resource", "__env", namesResource]);
}());

