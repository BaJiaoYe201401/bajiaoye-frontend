Site.controller('UserForgetCtrl', function ($rootScope, $scope, $window, $routeParams, $filter, $location, configConstants, worksSrv, userSrv) {


  $scope.getForgetPassword = function () {
    $scope.sendSuccess = false;
    $scope.sendTry = false;
    userSrv.getForgetPassword($scope.email).then(function (response) {
      var result = response.data;
      if(result == 'true') {
        $scope.sendSuccess = true;
      }else{
        $scope.sendTry = true;
      }
    });
  };

  var openWin = function (url) {
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "openwin");
    document.body.appendChild(a);
    a.click();
  };

  $scope.openEmailLink = function (email) {
    var arr = email.split('@');
    var link = 'http://email.' + arr[1];
    openWin(link);
  }


});