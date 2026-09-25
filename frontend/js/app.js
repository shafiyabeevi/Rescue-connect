/* =====================================================================
   Rescue Connect - AngularJS 1.x Application Module
   Uses: ngRoute (13-page routing) + ngAnimate (splash + page transitions)
   ===================================================================== */
var rescueApp = angular.module('rescueApp', ['ngRoute', 'ngAnimate']);

rescueApp.constant('API_BASE', 'http://localhost:5000/api');

rescueApp.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
  $routeProvider
    .when('/', { redirectTo: '/welcome' })
    .when('/welcome', { templateUrl: 'partials/welcome.html' })
    .when('/splash', { templateUrl: 'partials/splash.html', controller: 'SplashCtrl' })
    .when('/admin-login', { templateUrl: 'partials/admin-login.html', controller: 'LoginCtrl' })
    .when('/volunteer-login', { templateUrl: 'partials/volunteer-login.html', controller: 'LoginCtrl' })
    .when('/register', { templateUrl: 'partials/register.html', controller: 'RegisterCtrl' })
    .when('/dashboard', { templateUrl: 'partials/dashboard.html', controller: 'DashboardCtrl' })
    .when('/donation', { templateUrl: 'partials/donation.html', controller: 'DonationCtrl' })
    .when('/report', { templateUrl: 'partials/report.html', controller: 'ReportCtrl' })
    .when('/volunteers', { templateUrl: 'partials/volunteers.html', controller: 'VolunteerCtrl' })
    .when('/leaderboard', { templateUrl: 'partials/leaderboard.html', controller: 'LeaderboardCtrl' })
    .when('/notifications', { templateUrl: 'partials/notifications.html', controller: 'NotificationCtrl' })
    .when('/pets', { templateUrl: 'partials/pets.html', controller: 'PetCtrl' })
    .when('/food', { templateUrl: 'partials/food.html', controller: 'FoodCtrl' })
    .when('/funds', { templateUrl: 'partials/funds.html', controller: 'FundCtrl' })
    .otherwise({ redirectTo: '/welcome' });
}]);

/* Route guard: redirect to login if not authenticated; block /funds for non-admin */
rescueApp.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next) {
    var publicRoutes = ['', '/', '/welcome', '/splash', '/admin-login', '/volunteer-login', '/register'];
    var path = $location.path();
    if (publicRoutes.indexOf(path) === -1 && !AuthService.isLoggedIn()) {
      $location.path('/volunteer-login');
    }
    if (path === '/funds' && AuthService.getRole() !== 'admin') {
      $location.path('/dashboard');
    }
  });
}]);
