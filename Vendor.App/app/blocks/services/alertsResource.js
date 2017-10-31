(function () {
    "use strict";

    function alertsResource($resource, __env) {

        return {
            alerts: $resource(__env.BackendUrl + "/alerts/", null,
            {
                get: {
                    method: 'GET',
                    isArray:true,
                    url: __env.BackendUrl + "/alerts/get",
                },
                updateStatus: {
                    method: 'POST',
                    url: __env.BackendUrl + "/alerts/statusChanged"
                }
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("alertsResource", ["$resource", "__env", alertsResource]);
}());

