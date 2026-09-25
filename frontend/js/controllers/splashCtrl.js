/* Page 1: Splash Screen
   Demonstrates ngAnimate: the logo/text fade+slide in via CSS transition
   classes (see css/style.css .splash-fade), then auto-redirects. */
rescueApp.controller('SplashCtrl', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
  $scope.appName = 'Rescue Connect';
  $scope.tagline = 'Every Animal Deserves a Second Chance';
  $scope.showLogo = false;

  $timeout(function () { $scope.showLogo = true; }, 100);

  $timeout(function () {
    $location.path('/volunteer-login');
  }, 2500);
}]);
