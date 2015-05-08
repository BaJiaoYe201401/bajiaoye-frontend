SiteServices.factory('worksSrv', function ($http, $q, $filter, configConstants) {


  function getSoapMessage(apiName, requestParam, token) {
    var soapMessage = "";

    return soapMessage;
  }

  // Return the factory object
  return {
    getAllWorksByUserId: function (userId) {
      var url = configConstants.URLS.apiUrl + 'userOpus/' + userId;
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getWorksById: function (worksId) {
      var url = configConstants.URLS.apiUrl + 'opus/' + worksId;
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    initWorks: function (works) {
      var url = configConstants.URLS.apiUrl + 'opusCreate';
      var jsonStr = angular.toJson(works);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    updateWorks: function (works) {
      var url = configConstants.URLS.apiUrl + 'opusUpdate';
      var jsonStr = angular.toJson(works);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    saveCopyPage: function (page, worksId) {
      var url = configConstants.URLS.apiUrl + 'savePage/' + worksId;
      var jsonStr = angular.toJson(page);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    deletePage: function (page, worksId) {
      var url = configConstants.URLS.apiUrl + 'deletePage/' + worksId;
      var jsonStr = angular.toJson(page);
      var request = $http.post(url, jsonStr);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    deleteWorksById: function (worksId) {
      var url = configConstants.URLS.apiUrl + 'opusDelete/' + worksId;
      var request = $http.post(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    }
  }
});