/* Pages 2 & 3: Admin Login / Volunteer Login
   Same controller, decides which API endpoint + which home route to use
   based on the current URL path. */
rescueApp.controller('LoginCtrl', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
  $scope.isAdmin = $location.path() === '/admin-login';
  $scope.credentials = { email: '', password: '' };
  $scope.error = '';
  $scope.loading = false;

  $scope.submit = function (loginForm) {
    $scope.error = '';
    if (loginForm.$invalid) { $scope.error = 'Please enter a valid email and password.'; return; }
    $scope.loading = true;
    var endpoint = $scope.isAdmin ? '/auth/admin-login' : '/auth/volunteer-login';
    AuthService.login(endpoint, $scope.credentials).then(function (res) {
      $scope.loading = false;
      AuthService.saveSession(res.data);
      $location.path('/dashboard');
    }, function (err) {
      $scope.loading = false;
      $scope.error = (err.data && err.data.message) || 'Login failed. Please try again.';
    });
  };
}]);
