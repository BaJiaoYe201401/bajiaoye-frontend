Site.controller('SignUpCtrl', function ($rootScope, $scope, userSrv) {

  // Get all customers
  userSrv.getCustomerList().then(function (response) {
    var result = response.data;
    if (!_.isArray(result)) {
      result = [result];
    }
    $scope.customerList = result;
  });
});