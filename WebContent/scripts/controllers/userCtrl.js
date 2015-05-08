Site.controller('UserCtrl', function ($rootScope, $scope, $window, $routeParams, $filter, $location, configConstants, worksSrv, userSrv, $cookieStore) {

  $scope.userId = $routeParams.userid;

  $scope.user = $cookieStore.get("user");

  var currentPath = $location.path();

  if(currentPath == '/login' && $scope.user && $scope.user.isLogined) {
    $location.path('/users/'+$scope.user.userId+'/works');
  }

  if($scope.userId) {
    if(!$scope.user || $scope.user.userId != $scope.userId || !$scope.user.isLogined) {
      $location.path('/login');
    }
    
    userSrv.getUserInfo($scope.userId).then(function (response) {
      $scope.userInfo = response.data;
    });
  }

  $scope.loginName = '';
  $scope.password = '';
  if($scope.user) {
    $scope.loginName = $scope.user.email;
  }
  $scope.login = function () {
    if(!$scope.loginName || !$scope.password) {
      $scope.loginErrorMsg = true;
      return;
    }
    var user = {
      email: $scope.loginName,
      password: $scope.password
    };
    userSrv.loginWithPassword(user).then(function (response) {
      var result = response.data;
      if(result != 'false') {
        $scope.user = result;
        $("#loginInfo").show().delay(1000).fadeOut('slow');
        storeUserCookie(result);
        $location.path('/users/' + result.userId + '/works');
      }else{
        $scope.loginErrorMsg = true;
      }
    });
  };

  $scope.updateUser = function () {
    userSrv.updateUser($scope.userInfo).then(function (response) {
      var result = response.data;
      if(result) {
        $("#saveInfo").show().delay(1000).fadeOut('slow');
        console.log('save success');
      }
    });
  };

  $scope.loginOut = function () {
    removeUserCookie();
    $location.path('/login');
  };

  var storeUserCookie = function(user) {
    user.isLogined = true;
    $cookieStore.put("user", user);
  };

  var removeUserCookie = function() {
    $scope.user.isLogined = false;
    $cookieStore.put("user", $scope.user);
    //$cookieStore.remove("user");
  };

  $scope.changePassword = function() {
    $scope.oldPassMsg = false;
    $scope.newPassMsg = false;
    $scope.newPassSuccessMsg = false;
    if(!$scope.newPassword || !$scope.confirmNewPassword || !$scope.oldPassword) {
      return;
    }
    if($scope.newPassword != $scope.confirmNewPassword) {
      $scope.newPassMsg = true;
      return;
    }
    var user = {
      userId: $scope.userId,
      oldPassword: $scope.oldPassword,
      newPassword: $scope.newPassword
    };
    userSrv.changePassword(user).then(function (response) {
      var result = response.data;
      if(result == 'true') {
        $scope.newPassSuccessMsg = true;
        console.log('change success');
      }else{
        $scope.oldPassMsg = true;
        console.log('change error');
      }
    });
  };

  $scope.resetWarnMsg = function() {
    $scope.oldPassMsg = false;
    $scope.newPassMsg = false;
    $scope.newPassSuccessMsg = false;
  };

});