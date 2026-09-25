/* Page 5: Dashboard
   Role-based rendering: ADMIN sees org-wide stats + link to Funds page;
   VOLUNTEER sees personal score + nearby reports. Data binding drives
   which nav links appear (see partials/dashboard.html + header nav). */
rescueApp.controller('DashboardCtrl', ['$scope', 'AuthService', 'DataFactory', function ($scope, AuthService, DataFactory) {
  $scope.role = AuthService.getRole();
  $scope.name = AuthService.getName();
  $scope.isAdmin = $scope.role === 'admin';

  $scope.stats = {};

  if ($scope.isAdmin) {
    DataFactory.get('/users/volunteers').then(function (res) { $scope.stats.volunteerCount = res.data.length; });
    DataFactory.get('/donations').then(function (res) {
      $scope.stats.totalDonations = res.data.filter(function (d) { return d.verified; }).length;
      $scope.stats.totalAmount = res.data.filter(function (d) { return d.verified; }).reduce(function (s, d) { return s + d.amount; }, 0);
    });
    DataFactory.get('/reports').then(function (res) { $scope.stats.reportCount = res.data.length; });
  } else {
    DataFactory.get('/users/me').then(function (res) { $scope.myScore = res.data.score; });
    DataFactory.get('/notifications').then(function (res) { $scope.myNotifications = res.data.slice(0, 5); });
  }

  DataFactory.get('/reports').then(function (res) { $scope.recentReports = res.data.slice(0, 5); });
}]);
