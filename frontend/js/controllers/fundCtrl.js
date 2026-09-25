/* Page 13: Fund Received (ADMIN ONLY)
   Shows every verified donation + who paid what, plus the full list of
   registered volunteers/admin, and an optional MySQL relational report. */
rescueApp.controller('FundCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
  $scope.donations = [];
  $scope.totalAmount = 0;
  $scope.users = [];
  $scope.mysqlRows = [];
  $scope.mysqlConnected = false;
  $scope.loading = true;

  DataFactory.get('/funds').then(function (res) {
    $scope.donations = res.data.donations;
    $scope.totalAmount = res.data.totalAmount;
    $scope.loading = false;
  });

  DataFactory.get('/funds/registered-users').then(function (res) { $scope.users = res.data; });
  DataFactory.get('/funds/mysql-report').then(function (res) {
    $scope.mysqlRows = res.data.rows;
    $scope.mysqlConnected = res.data.connected;
    $scope.mysqlWarning = res.data.warning;
  });
}]);
