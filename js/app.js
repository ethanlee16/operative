var app = angular.module('Operative', []);

app.controller('MainCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {

    // Meta panel
    $scope.confName = "OPMUN";
    $scope.committeeName = "UNEP";
    $scope.time = Date.now();

    var updateTime = function() {
        $scope.time = Date.now();
        $timeout(updateTime, 1000);
    }

    $timeout(updateTime, 1000);
    
    // Speakers panel
    $http.get('tests/countries.json').success(function(data) {
        $scope.speakers = data;
    });

    // Timer and comments panel
    $scope.timer = 6000;
    $scope.paused = false;

    $scope.startTimer = function() {
        $scope.paused = false;
        $timeout(updateTimer, 10);
    }

    $scope.pauseTimer = function() {
        $scope.paused = true;
    }

    var updateTimer = function () {
        if($scope.timer > 0 && !$scope.paused) {
            console.log($scope.paused);
            $scope.timer--;
            $timeout(updateTimer, 10);
        } else if($scope.timer === 0) {
            $scope.timer = 6000;
        }
    }  
}]);

app.filter('timer', function() {
    return function(input) {
        var time = input;
        var min = 0, sec = 0, mill = 0;
        while(time / 6000 >= 1) {
            min++;
            time -= 6000;
        }
        while(time / 100 >= 1) {
            sec++;
            time -= 100;
        }
        mill = time;
        millString = ('00' + mill).substr(-2);
        secString = ('00' + sec).substr(-2);
        
        return min + ":" + secString + " " + millString
    }
});