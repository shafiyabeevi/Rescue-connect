/* Page 11: Pet Booking / Adoption
   Uses <rc-status-pill> custom directive to show Available/Booked/Adopted. */
rescueApp.controller('PetCtrl', ['$scope', 'DataFactory', 'AuthService', function ($scope, DataFactory, AuthService) {
  $scope.pets = [];
  $scope.loading = true;
  $scope.isAdmin = AuthService.getRole() === 'admin';
  $scope.newPet = { name: '', animalType: '', age: '', foodDetails: '', image: '' };

  function load() {
    DataFactory.get('/pets').then(function (res) { $scope.pets = res.data; $scope.loading = false; });
  }
  load();

  $scope.book = function (pet) {
    DataFactory.put('/pets/' + pet._id + '/book', {}).then(function (res) {
      pet.availability = res.data.availability;
    });
  };

  $scope.addPet = function (petForm) {
    if (petForm.$invalid) return;
    DataFactory.post('/pets', $scope.newPet).then(function () {
      $scope.newPet = { name: '', animalType: '', age: '', foodDetails: '', image: '' };
      load();
    });
  };
}]);
