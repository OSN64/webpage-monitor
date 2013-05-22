angular.module('myApp.controllers', []).
  controller('taskList', ['$scope', '$http', function($scope, $http) {
    $scope.$on('taskChanged', function () {
      $http.get('/partials/taskList').success(function (data) {
        $scope.taskList = data.taskList;
      });
    });
    $scope.$emit('taskChanged');
  }]).
  controller('newTaskForm', ['$scope', '$http', function($scope, $http) {
    $scope.url = 'http://';
    $scope.compareFunc = 'return $old("html").html() === $new("html").html()';
    $scope.submit = function () {
      $http.post('/newTask', {
        name: $scope.name,
        url: $scope.url,
        interval: $scope.interval,
        email: $scope.email,
        compareFunc: $scope.compareFunc
      }).success(function () {
        $scope.$emit('taskChanged');
      });
    };
  }]).
  controller('eachTask', ['$scope', '$http', function ($scope, $http) {
    $scope.submit = function () {
      $http.post('/editTask', {
        id: $scope.task.id,
        name: $scope.task.name,
        url: $scope.task.url,
        interval: $scope.task.interval,
        email: $scope.task.email,
        compareFunc: $scope.task.compareFunc
      }).success(function () {
        $scope.$emit('taskChanged');
      });
    };

    $scope.remove = function () {
      $http.delete('/removeTask/' + $scope.task.id).success(function () {
        $scope.$emit('taskChanged');
      });
    };
  }]);

