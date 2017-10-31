(function () {
    "use strict";

    function spendingsResource($resource, __env) {

        return {
            spendings: $resource(__env.BackendUrl + "/spendings/", null,
            {
                get: {
                    method: 'GET',
                    url: __env.BackendUrl + "/spendings/get",

                },
                getById: {
                    method: 'GET',
                    url: __env.BackendUrl + "/spendings/get/:name",
                    params: {
                        name: '@name'
                    }
                },
                getByMonth: {
                    method: 'GET',
                    url: __env.BackendUrl + "/spendings/get/month/:month",
                    params: {
                        month: '@month'
                    }
                },
                post: {
                    method: 'POST',
                    url: __env.BackendUrl + "/spendings/post"
                },
                update: {
                    method: 'POST',
                    url: __env.BackendUrl + "/spendings/update"
                },
                delete: {
                    method: 'POST',
                    url: __env.BackendUrl + "/spendings/delete/:id",
                    params: {
                        id: '@id'
                    }
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("spendingsResource", ["$resource", "__env", spendingsResource]);
}());

