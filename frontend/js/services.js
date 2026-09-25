/* =====================================================================
   SERVICE: AuthService  (Angular "service" - login/session/role state)
   Used on: every page (route guard), admin-login, volunteer-login, register,
            dashboard (role-based rendering), funds (admin-only guard)
   ===================================================================== */
rescueApp.service('AuthService', ['$http', '$window', 'API_BASE', function ($http, $window, API_BASE) {

  this.login = function (url, credentials) {
    return $http.post(API_BASE + url, credentials);
  };

  this.register = function (data) {
    return $http.post(API_BASE + '/auth/register', data);
  };

  this.saveSession = function (data) {
    $window.localStorage.setItem('rc_token', data.token);
    $window.localStorage.setItem('rc_role', data.role);
    $window.localStorage.setItem('rc_name', data.name);
    $window.localStorage.setItem('rc_userId', data.userId);
  };

  this.getToken = function () { return $window.localStorage.getItem('rc_token'); };
  this.getRole = function () { return $window.localStorage.getItem('rc_role'); };
  this.getName = function () { return $window.localStorage.getItem('rc_name'); };
  this.getUserId = function () { return $window.localStorage.getItem('rc_userId'); };
  this.isLoggedIn = function () { return !!this.getToken(); };

  this.logout = function () {
    $window.localStorage.removeItem('rc_token');
    $window.localStorage.removeItem('rc_role');
    $window.localStorage.removeItem('rc_name');
    $window.localStorage.removeItem('rc_userId');
  };
}]);

/* =====================================================================
   FACTORY: DataFactory  (Angular "factory" - generic authenticated $http wrapper
   used by every data-driven page: donation, report, volunteers, leaderboard,
   notifications, pets, food, funds)
   ===================================================================== */
rescueApp.factory('DataFactory', ['$http', 'API_BASE', 'AuthService', function ($http, API_BASE, AuthService) {

  function authHeaders() {
    return { headers: { Authorization: 'Bearer ' + AuthService.getToken() } };
  }

  return {
    get: function (path) { return $http.get(API_BASE + path, authHeaders()); },
    post: function (path, data) { return $http.post(API_BASE + path, data, authHeaders()); },
    put: function (path, data) { return $http.put(API_BASE + path, data, authHeaders()); }
  };
}]);

/* =====================================================================
   FACTORY: ValidationFactory (Angular "factory" - shared registration validators)
   Used on: register page (and re-used for inline hints elsewhere)
   ===================================================================== */
rescueApp.factory('ValidationFactory', [function () {
  return {
    firstname: function (v) { return !!v && v.trim().length >= 3; },
    lastname: function (v) { return !!v && v.trim().length >= 1; },
    phone: function (v) { return /^[0-9]{10}$/.test(v || ''); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ''); },
    password: function (v) { return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(v || ''); },
    age: function (v) { return v >= 18 && v <= 60; }
  };
}]);
