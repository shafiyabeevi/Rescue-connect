/* Page 9: Leaderboard
   Uses <rc-score-bar> custom directive + `rankBadge` filter to visualize
   ranking of volunteers by their rescue-activity score. */
rescueApp.controller('LeaderboardCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
  $scope.ranking = [];
  $scope.loading = true;
  $scope.maxScore = 1;

  DataFactory.get('/leaderboard').then(function (res) {
    $scope.ranking = res.data;
    $scope.maxScore = Math.max.apply(null, res.data.map(function (v) { return v.score; }).concat([1]));
    $scope.loading = false;
  });
}]);
