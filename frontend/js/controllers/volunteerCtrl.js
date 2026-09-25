/* Page 8: Volunteers
   Search box bound with ng-model -> filtered client-side with the custom
   `volunteerSearch` filter (also supports server-side ?q= via DataFactory). */
rescueApp.controller('VolunteerCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
  $scope.volunteers = [];
  $scope.searchText = '';
  $scope.loading = true;

  DataFactory.get('/users/volunteers').then(function (res) {
    $scope.volunteers = res.data;
    $scope.loading = false;
  });
}]);
