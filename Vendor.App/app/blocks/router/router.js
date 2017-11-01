﻿(function () {
    'use strict';

    angular
        .module('blocks.router')
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'USER_ROLES'];

    function config($stateProvider, $urlRouterProvider, USER_ROLES) {
        $urlRouterProvider.otherwise("/login");
        $stateProvider
            .state('login', {
                url: "/login",
                data: { pageTitle: 'Login', requiresLogin: false, roles: [] },
                views: {
                    'loginView': {
                        templateUrl: "app/account/login.html",
                        controller: Login,
                    }
                }
            })
            .state('accessdenied', {
                url: "/accessdenied",
                data: { pageTitle: 'Access Denied', requiresLogin: false },
                views: {
                    'loginView': {
                        templateUrl: "app/account/accessdenied.html",
                    }
                },
            })

            .state('abstract', {
                abstract: true,
                url: "",
                views: {
                    'mainView': {
                        templateUrl: "app/layout/content.html",
                    }
                }
            })

            .state('abstract.dashboard', {
                url: "/dashboard",
                templateUrl: "app/dashboard/dashboard.html",
                controller: dashboard,
                data: {
                    pageTitle: 'Dashboard',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.names', {
                url: "/names",
                templateUrl: "app/names/names.html",
                controller: names,
                data: {
                    pageTitle: 'Names',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.cars', {
                url: "/cars",
                templateUrl: "app/cars/cars.html",
                controller: cars,
                data: {
                    pageTitle: 'Cars',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.carRents', {
                url: "/rent",
                templateUrl: "app/carRents/carRents.html",
                //controller: Settings,
                data: {
                    pageTitle: 'Car Rents',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.rents', {
                url: "/rents",
                templateUrl: "app/rents/rents.html",
                controller: rents,
                data: {
                    pageTitle: 'Rents',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.settings', {
                url: "/settings",
                templateUrl: "app/settings/settings.html",
                controller: Settings,
                data: {
                    pageTitle: 'Vendor settings',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.alerts', {
                url: "/alerts",
                templateUrl: "app/alerts/alerts.html",
                controller: alerts,
                data: {
                    pageTitle: 'Alerts',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin,USER_ROLES.employee],
                },
            })

            .state('abstract.clients', {
                url: "/clients",
                templateUrl: "app/clients/clients.html",
                controller: clients,
                data: {
                    pageTitle: 'Clients',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.spendings', {
                url: "/spendings",
                templateUrl: "app/spendings/spendings.html",
                controller: spendings,
                data: {
                    pageTitle: 'Spendings',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })

            .state('abstract.repairs', {
                url: "/repairs/:car_id",
                templateUrl: "app/repairs/repairs.html",
                controller: repairs,
                data: {
                    pageTitle: 'Repairs',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
                resolve:{
                    check : function($stateParams){
                        if(!$stateParams.car_id)
                         $scope.$on('$stateChangeStart', function(e) {
                            e.preventDefault();
                          });
                    }
                }
            })

        ;
    }

    run.$inject = ['$rootScope', '$state', 'editableOptions'];

    function run($rootScope, $state, editableOptions) {
        $rootScope.$state = $state;
        editableOptions.theme = 'bs3';
    }


})();