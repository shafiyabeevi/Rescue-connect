/* Page 7: Report Found Animal
   Uses <rc-image-preview> custom directive for the photo upload. */
rescueApp.controller('ReportCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
  $scope.report = { description: '', photo: '', place: '', animalType: '', foundHow: '' };
  $scope.message = '';
  $scope.loading = false;

  $scope.submit = function (reportForm) {
    $scope.message = '';
    if (reportForm.$invalid) { $scope.message = 'Please complete all required fields.'; return; }
    $scope.loading = true;
    DataFactory.post('/reports', $scope.report).then(function (res) {
      $scope.loading = false;
      $scope.message = res.data.message;
      $scope.report = { description: '', photo: '', place: '', animalType: '', foundHow: '' };
      reportForm.$setPristine();
    }, function (err) {
      $scope.loading = false;
      $scope.message = (err.data && err.data.message) || 'Failed to submit report.';
    });
  };
}]);
