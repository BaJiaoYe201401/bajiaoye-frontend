Site.directive('baseTooltip', function () {
  return function (scope, element, attrs) {
    element.tooltip();
  };
});

// directive for a single list
Site.directive('dndList', function() {

  return function(scope, element, attrs) {

    // variables used for dnd
    var toUpdate;
    var startIndex = -1;

    // watch the model, so we always know what element
    // is at a specific position
    scope.$watch(attrs.dndList, function(value) {
      toUpdate = value;
    },true);

    // use jquery to make the element sortable (dnd). This is called
    // when the element is rendered
    $(element[0]).sortable({
      items:'li',
      start:function (event, ui) {
        // on start we define where the item is dragged from
        startIndex = ($(ui.item).index());
      },
      stop:function (event, ui) {
        // on stop we determine the new index of the
        // item and store it there
        var newIndex = ($(ui.item).index());
        var toMove = toUpdate[startIndex];
        toUpdate.splice(startIndex,1);
        toUpdate.splice(newIndex,0,toMove);

        // we move items in the array, if we want
        // to trigger an update in angular use $apply()
        // since we're outside angulars lifecycle
        scope.$apply(scope.model);
      },
      cancel: "li>a",
      axis:'y'
    })
  }
});

Site.directive('colorPicker', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      element.colorPicker({
        // update the scope whenever we pick a new color
        onColorChange: function(id, newValue) {
          scope.$apply(function() {
            ngModel.$setViewValue(newValue);
          });
        }
      });

      ngModel.$render = function () {
        element.val(ngModel.$viewValue);
        element.change();
      };
    }
  }
});

Site.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});