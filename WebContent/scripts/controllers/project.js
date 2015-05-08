Site.controller('Project', function ($rootScope, $scope, $window, $routeParams, $filter, $location, configConstants, ProjectService, WorksService) {

  // get user cookie object{id: 1, token:xxxxxx}
  $scope.userId = $routeParams.userid;
  $scope.templateId = $routeParams.tplid;
  var worksId = $routeParams.worksid;
  var works = {id: worksId};
  $scope.selectedPageIndex = 0;

  ProjectService.getTemplateById($scope.templateId).then(function (response) {
    var ret = response.data;
    var urlPrefix = configConstants.URLS.baseUrl + 'templates/tpls/' + ret.id + '/';
    ret.thumb = urlPrefix + ret.thumb;
    var pages = ret.pages;
    var temp = [];
    if (!_.isArray(pages)) {
      pages = [pages];
    }
    _.forEach(pages, function (item) {
      item.background = urlPrefix + item.background;
      var elements = [];
      if (item.styleType == 'common') {
        _.forEach(item.animateImgs, function (element) {
          element.src = urlPrefix + element.src;
          elements.push(element);
        });
        item.animateImgs = elements;
      }
      if (item.styleType == 'start') {
        _.forEach(item.animateImgs, function (element) {
          element.src = urlPrefix + element.src;
          elements.push(element);
        });
        item.animateImgs = elements;
      }
      temp.push(item);

    });

    var index = $scope.selectedPageIndex;
    $scope.selectedPage = temp[index];
    ret.pages = temp;
    $scope.template = ret;
  });

  $scope.selectPage = function (index) {
    $scope.selectedPageIndex = index;
    $scope.selectedPage = $scope.template.pages[index];
  };

  $scope.changePageName = function (index) {

  }

  $scope.deletePage = function (index) {
//    $scope.selectedPageIndex = index;
  }

  $scope.dragPage = function (index) {
//    $scope.selectedPageIndex = index;
  }

  $scope.copyCurrentPage = function () {
    var page = angular.copy($scope.selectedPage);
    page.index = $scope.template.pages.length;
    $scope.template.pages.push(page);
  };

  $scope.saveWorks = function () {
    works.configurations = $scope.template.pages;
    WorksService.updateWorks(works).then(function (response) {
      var result = response.data;
      if(result == 'true') {
        console.log('bao cun cheng gong');
      }
    });
  }

});