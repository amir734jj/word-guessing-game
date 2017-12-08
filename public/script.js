var app = angular.module('roverApp', []);
app.constant("wordGameAppApiPrefix", "api");
app.controller('roverCtrl', ['$scope', '$http', '$timeout', 'wordGameAppApiPrefix', function($scope, $http, $timeout, wordGameAppApiPrefix) {

    $scope.initialized = false;
    $scope.characterLength = 1;
    $scope.characterArray = [];
    $scope.result = "result would be here!";

    $scope.createArray = function() {
      $scope.characterArray = Array($scope.characterLength || 5).fill("");
    };

    $scope.$watch("characterLength", function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.initialized = true;
        $scope.createArray();
      }
    });

    $scope.getResult = function() {
      $http.post(wordGameAppApiPrefix + "/getResult/", $scope.characterArray).then(function(response) {
        $scope.result = $scope.prettyPrintArray(response.data);
      });
    };

    $scope.prettyPrintArray = function(arr) {
      var str = "[\n";

      arr.map(function(x) {
        str += "\t" + x + "\n";
      });

      str += "]";

      return str;
    };
}]);
