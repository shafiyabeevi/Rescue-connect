/* =====================================================================
   CUSTOM DIRECTIVES
   ===================================================================== */

/* Used on: Registration page - shows a live green/red checklist next to
   the password field as the user types (min 8, alphanumeric) */
rescueApp.directive('rcPasswordStrength', function () {
  return {
    restrict: 'E',
    scope: { password: '=' },
    template:
      '<div class="pw-strength">' +
      '  <span ng-class="{ok: password.length >= 8}">● Min 8 characters</span>' +
      '  <span ng-class="{ok: hasLetterNumber(password)}">● Letters & numbers</span>' +
      '</div>',
    link: function (scope) {
      scope.hasLetterNumber = function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)/.test(v || '');
      };
    }
  };
});

/* Used on: Report page & Pet Booking page - image upload with instant preview */
rescueApp.directive('rcImagePreview', function () {
  return {
    restrict: 'E',
    scope: { model: '=' },
    template: '<div class="img-upload">' +
      '<input type="file" accept="image/*" onchange="angular.element(this).scope().fileChanged(this.files[0])">' +
      '<img ng-if="model" ng-src="{{model}}" class="preview-img">' +
      '</div>',
    link: function (scope) {
      scope.fileChanged = function (file) {
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          scope.$apply(function () { scope.model = e.target.result; });
        };
        reader.readAsDataURL(file);
      };
    }
  };
});

/* Used on: Leaderboard page - renders a proportional horizontal score bar */
rescueApp.directive('rcScoreBar', function () {
  return {
    restrict: 'E',
    scope: { score: '=', max: '=' },
    template: '<div class="score-bar-track"><div class="score-bar-fill" ng-style="{width: pct() + \'%\'}"></div></div>',
    link: function (scope) {
      scope.pct = function () {
        if (!scope.max) return 0;
        return Math.min(100, (scope.score / scope.max) * 100);
      };
    }
  };
});

/* Used on: Pet Booking page & Food Details page - reusable status/availability pill */
rescueApp.directive('rcStatusPill', function () {
  return {
    restrict: 'E',
    scope: { status: '=' },
    template: '<span class="pill" ng-class="status | lowercase">{{status}}</span>'
  };
});
