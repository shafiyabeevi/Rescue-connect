/* Page 4: Registration
   Full client-side validation via ValidationFactory + $watch based two-way
   data binding for live error hints, then posts to /auth/register. */
rescueApp.controller('RegisterCtrl', ['$scope', '$location', 'AuthService', 'ValidationFactory',
  function ($scope, $location, AuthService, ValidationFactory) {

  $scope.data = { firstname: '', lastname: '', phone: '', email: '', password: '', age: '', gender: '', place: '' };
  $scope.errors = {};
  $scope.serverMessage = '';
  $scope.success = false;
  $scope.loading = false;

  $scope.validateField = function (field) {
    switch (field) {
      case 'firstname': $scope.errors.firstname = !ValidationFactory.firstname($scope.data.firstname) ? 'First name must be at least 3 characters.' : ''; break;
      case 'lastname': $scope.errors.lastname = !ValidationFactory.lastname($scope.data.lastname) ? 'Last name is required.' : ''; break;
      case 'phone': $scope.errors.phone = !ValidationFactory.phone($scope.data.phone) ? 'Phone must be exactly 10 digits.' : ''; break;
      case 'email': $scope.errors.email = !ValidationFactory.email($scope.data.email) ? 'Enter a valid email address.' : ''; break;
      case 'password': $scope.errors.password = !ValidationFactory.password($scope.data.password) ? 'Min 8 chars, letters + numbers.' : ''; break;
      case 'age': $scope.errors.age = !ValidationFactory.age(Number($scope.data.age)) ? 'Age must be between 18 and 60.' : ''; break;
      case 'gender': $scope.errors.gender = !$scope.data.gender ? 'Please select gender.' : ''; break;
      case 'place': $scope.errors.place = !$scope.data.place ? 'Place is required.' : ''; break;
    }
  };

  $scope.formValid = function () {
    ['firstname','lastname','phone','email','password','age','gender','place'].forEach($scope.validateField);
    return Object.keys($scope.errors).every(function (k) { return !$scope.errors[k]; });
  };

  $scope.submit = function () {
    $scope.serverMessage = '';
    if (!$scope.formValid()) { $scope.serverMessage = 'Please fix the highlighted fields.'; return; }
    $scope.loading = true;
    AuthService.register($scope.data).then(function (res) {
      $scope.loading = false;
      $scope.success = true;
      $scope.serverMessage = res.data.message;
      setTimeout(function () { $scope.$apply(function () { $location.path('/volunteer-login'); }); }, 1500);
    }, function (err) {
      $scope.loading = false;
      $scope.serverMessage = (err.data && err.data.message) || 'Registration failed.';
    });
  };
}]);
