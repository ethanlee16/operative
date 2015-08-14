var app = angular.module('Operative', ['ui.bootstrap']);

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
    /*
    $http.get('tests/countries.json').success(function(data) {
        $scope.speakers = data;
    });
    */

    $scope.speakers = [];

    $http.get('js/countries-list.json').success(function(data) {
        $scope.countries = data;

    });

    $scope.addCountry = function() {
        var selectedCountry = $scope.countries.filter(function(country) {
            return country.name.toLowerCase() === $scope.newCountry.name.toLowerCase();
        });
        selectedCountry = selectedCountry[0];
        console.log(selectedCountry);
        $scope.speakers.push({
            "name": selectedCountry.name,
            "img": "img/flags/" + selectedCountry['alpha-2'].toLowerCase() + ".png"
        });
        $scope.newCountry = "";
    }

    $scope.startsWith = function(state, viewValue) {
      return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
    } 

    $scope.removeCountry = function(i) {
        $scope.speakers.splice(i, 1);
    }

    // Timer and comments panel

    $scope.speakingTime = 60;
    $scope.timer = $scope.speakingTime;
    $scope.paused = true;
    $scope.status = "Start";

    $scope.setTime = function() {
        $scope.minutesTime = $scope.minutesTime || 0;
        $scope.secondsTime = $scope.secondsTime || 0;
        $scope.speakingTime = (Number($scope.minutesTime) * 60) + Number($scope.secondsTime);
        $scope.timer = $scope.speakingTime;
    }

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
        $scope.timer = $scope.speakingTime;
    }

    $scope.getProgress = function() {
        return (($scope.speakingTime - $scope.timer) / $scope.speakingTime) * 100;
    }

    var updateTimer = function () {
        if($scope.timer > 0 && !$scope.paused) {
            console.log($scope.paused);
            $scope.timer--;
            $timeout(updateTimer, 1000);
        } else if($scope.timer === 0) {
            $scope.removeCountry(0);
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