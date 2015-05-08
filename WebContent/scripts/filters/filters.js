SiteFilters.filter('trim', function () {
  return function (value) {
    return value.replace(/^\s+|\s+$/g, '');
  };
});

SiteFilters.filter('to_trusted', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };

}]);
