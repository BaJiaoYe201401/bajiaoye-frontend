//*******************************************
// Main Site configuration and control
//*******************************************

var SiteFilters = angular.module('SiteFilters', []);
var SiteServices = angular.module('SiteServices', []);
var Site = angular.module('Site', ['ngRoute', 'ngSanitize', 'SiteFilters', 'SiteServices',
  'ui.bootstrap', 'ngCookies', 'ja.qr', 'angularFileUpload', 'ngAnimate','colorpicker.module']);

// Top level app controller
Site.controller('AppController', function ($scope, $rootScope, $location, $window, configConstants) {


});

// Do any supplementary top level manipulation based on route parameters here
function RouteController($scope, $rootScope, $routeParams) {
  $rootScope.setCurrentMenuTab = function (tabVal) {
    $rootScope.currentMenuTab = tabVal;
    $routeParams.menutab = tabVal;
  };
  $rootScope.currentMenuTab = $routeParams.menutab;
}

// Route configuration - add configuration for new pages here
// Note: reloadOnSearch : false will prevent page reload when the URL search parameters are changed.
Site.config(function ($routeProvider) {

  $routeProvider
    .when('/users/:userid/works', {templateUrl: 'views/works.html', controller: 'RouteController'})
    .when('/users/:userid/works-start', {templateUrl: 'views/start.html', controller: 'RouteController'})
    .when('/users/:userid/works-create/:tplid', {templateUrl: 'views/create.html', controller: 'RouteController'})
    .when('/users/:userid/works-edit/:worksid', {templateUrl: 'views/create.html', controller: 'RouteController'})
    .when('/users/:userid/mysetting', {templateUrl: 'views/mysetting.html', controller: 'RouteController'})
    .when('/users/:userid/resetpassword', {templateUrl: 'views/changePassword.html', controller: 'RouteController'})
    .when('/login', {templateUrl: 'views/login.html', controller: 'RouteController'})
    .when('/home', {templateUrl: 'views/home.html', controller: 'RouteController'})
    .when('/register', {templateUrl: 'views/register.html', controller: 'RouteController'})
    .when('/forget', {templateUrl: 'views/forget.html', controller: 'RouteController'})
    .when('/test', {templateUrl: 'views/test.html', controller: 'RouteController'})
    .when('/signUpList', {templateUrl: 'views/signup.html', controller: 'RouteController'})
    .otherwise({redirectTo: '/login'});
});

// Enable jQuery CORS
$.support.cors = true;


//*******************************************
// Initial setup
// Configure environment here
//*******************************************

Site.run(function ($rootScope, $location, $cookies) {


});