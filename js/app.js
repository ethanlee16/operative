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
    $scope.timer = 60;
    $scope.paused = true;
    $scope.status = "Start";

    $scope.toggleTimer = function() {
        $scope.paused = !$scope.paused;
        if($scope.status === "Start") {
            $scope.status = "Stop";
            $timeout(updateTimer, 1000);
        } else {
            $scope.status = "Start";
        }
    }

    $scope.resetTimer = function() {
        $scope.paused = true;
        $scope.status = "Start";
        $scope.timer = 60;
    }

    $scope.getProgress = function() {
        return ((60 - $scope.timer) / 60) * 100;
    }

    var updateTimer = function () {
        if($scope.timer > 0 && !$scope.paused) {
            console.log($scope.paused);
            $scope.timer--;
            $timeout(updateTimer, 1000);
        } else if($scope.timer === 0) {
            $scope.resetTimer();
        }
    }  
}]);

app.filter('timer', function() {
    return function(input) {
        var time = input;
        var min = 0, sec = 0, mill = 0;
        while(time / 60 >= 1) {
            min++;
            time -= 60;
        }
        sec = time;
        secString = ('00' + sec).substr(-2);
        
        return min + ":" + secString;
    }
});