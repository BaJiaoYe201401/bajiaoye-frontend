Site.controller('UserRegisterCtrl', function ($rootScope, $scope, $window, $routeParams, $filter, $location, configConstants, worksSrv, userSrv) {

  $scope.loginName = '';
  $scope.password = '';
  $scope.confirmPassword = '';

  $scope.register = function () {
    if($scope.loginName == '' || $scope.password == '' || $scope.confirmPassword == '') {
//      return;
      console.log('null');
      $scope.errorPassMsg = true;
      $scope.errorRegMsg = true;
      return;
    }else if(($scope.password != $scope.confirmPassword) || ($scope.password == '')) {
      $scope.errorPassMsg = true;
      return;
    }
    var user = {
      email: $scope.loginName,
      password: $scope.password
    };
    userSrv.registerUser(user).then(function (response) {
      var result = response.data;
      if(result != 'false') {
        $location.path('/login');
      }else{
        $scope.errorRegMsg = true;
      }
    });
  };


});