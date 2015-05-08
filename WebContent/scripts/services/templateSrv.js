SiteServices.factory('templateSrv', function ($http, $q, $filter, configConstants) {

  // Return the factory object
  return {
    getTemplateList: function () {
      var url = configConstants.URLS.apiUrl + 'tplList';
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getTemplateById: function ($tplId) {
      var url = configConstants.URLS.apiUrl + 'tpl/' + $tplId;
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getTemplateStyleList: function (type) {
      var url = configConstants.URLS.apiUrl + 'styleList/' + type;
      var request = $http.get(url);
      request.then(function (response) {
        response = response.data;
      }, function (response) {
        //alert(data);
        // For API call fails
      });
      return request;
    },

    getTemplateStyleById: function (name) {
      var url = configConstants.URLS.apiUrl + 'style/' + name;
      var request = $http.get(url);
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