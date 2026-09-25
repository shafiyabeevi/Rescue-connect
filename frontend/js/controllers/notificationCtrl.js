/* Page 10: Notifications
   Reads from /api/notifications which is populated automatically whenever
   a Report is created near the volunteer's registered place. */
rescueApp.controller('NotificationCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
  $scope.notifications = [];
  $scope.loading = true;

  function load() {
    DataFactory.get('/notifications').then(function (res) {
      $scope.notifications = res.data;
      $scope.loading = false;
    });
  }
  load();

  $scope.markRead = function (n) {
    DataFactory.put('/notifications/' + n._id + '/read', {}).then(function () { n.read = true; });
  };
}]);
