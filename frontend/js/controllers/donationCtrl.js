/* Page 6: Donation - payment details are recorded immediately after submit. */
rescueApp.controller('DonationCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
  $scope.donation = { name: '', phone: '', amount: '', age: '', paymentMethod: 'UPI', upiId: '' };
  $scope.step = 1; // 1 = form, 3 = done
  $scope.message = '';
  $scope.loading = false;

  $scope.donate = function (donateForm) {
    $scope.message = '';
    if (donateForm.$invalid) { $scope.message = 'Please fill all fields correctly.'; return; }
    $scope.loading = true;
    DataFactory.post('/donations/initiate', $scope.donation).then(function (res) {
      $scope.loading = false;
      $scope.message = res.data.message;
      $scope.step = 3;
    }, function (err) {
      $scope.loading = false;
      $scope.message = (err.data && err.data.message) || 'Could not start donation.';
    });
  };

  $scope.reset = function () {
    $scope.donation = { name: '', phone: '', amount: '', age: '', paymentMethod: 'UPI', upiId: '' };
    $scope.step = 1; $scope.message = '';
  };
}]);
