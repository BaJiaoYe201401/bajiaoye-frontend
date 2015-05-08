SiteServices.factory('userSrv', function ($http, $q, $filter, configConstants) {


  // Return the factory object
  return {

    loginWithPassword: function (user) {
      var url = configConstants.URLS.apiUrl + 'login';
      var jsonStr = angular.toJson(user);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    registerUser: function (user) {
      var url = configConstants.URLS.apiUrl + 'register';
      var jsonStr = angular.toJson(user);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getUserInfo: function (id) {
      var url = configConstants.URLS.apiUrl + 'users/' + id;
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    updateUser: function (user) {
      var url = configConstants.URLS.apiUrl + 'userUpdate';
      var jsonStr = angular.toJson(user);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    changePassword: function (user) {
      var url = configConstants.URLS.apiUrl + 'userPass/reset';
      var jsonStr = angular.toJson(user);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getForgetPassword: function (email) {
      var url = configConstants.URLS.apiUrl + 'forgetNewPass/' + email;
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getCustomerList: function () {
      var url = configConstants.URLS.apiUrl + 'signupList';
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },
  }
});