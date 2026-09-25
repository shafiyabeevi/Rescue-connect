/* Page 12: Food Details - which animal requires which food */
rescueApp.controller('FoodCtrl', ['$scope', 'DataFactory', 'AuthService', function ($scope, DataFactory, AuthService) {
  $scope.foods = [];
  $scope.loading = true;
  $scope.isAdmin = AuthService.getRole() === 'admin';
  $scope.newFood = { animalType: '', foodName: '', quantity: '', frequency: '', notes: '' };

  function load() {
    DataFactory.get('/foods').then(function (res) { $scope.foods = res.data; $scope.loading = false; });
  }
  load();

  $scope.addFood = function (foodForm) {
    if (foodForm.$invalid) return;
    DataFactory.post('/foods', $scope.newFood).then(function () {
      $scope.newFood = { animalType: '', foodName: '', quantity: '', frequency: '', notes: '' };
      load();
    });
  };
}]);
