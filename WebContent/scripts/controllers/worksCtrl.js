Site.controller('WorksCtrl', function ($rootScope, $scope, $window, $routeParams, $filter, $location, configConstants, worksSrv, templateSrv, FileUploader, $sce, $cookieStore) {

  var tplId = $routeParams.tplid;
  var worksId = $routeParams.worksid;

  // get user cookie object{id: 1, token:xxxxxx}
  $scope.userId = $routeParams.userid;
  $scope.allWorks = [];
  $scope.tplList = [];
  $scope.pageWorks = {};
  $scope.selectedTab = 'all';
  $scope.worksName = '';
  $scope.selectedPageIndex = 0;
  $scope.baseUrl = configConstants.URLS.baseUrl;
  $scope.apiUrl = configConstants.URLS.apiUrl;
  $scope.worksInfo = {};
  $scope.visitUrl = '';
  $scope.styleList = [];
  $scope.secVideoUrl = '';

  // get current cookie
  $scope.user = $cookieStore.get("user");
  if (!$scope.user || $scope.user.userId != $scope.userId) {
    $location.path('/login');
  }

  $scope.getAllWorksByUserId = function (id) {
    // Get all works by user ID, works.html
    worksSrv.getAllWorksByUserId(id).then(function (response) {
      var result = response.data;
      if (!_.isArray(result)) {
        result = [result];
      }
//      $scope.allWorks = result;
      var temp = [];
      _.forEach(result, function (item) {
        item.visitUrl = $scope.baseUrl + 'works/' + item.id + '/' + item.url + '.html';
        temp.push(item);
      });
      $scope.allWorks = result;
    });
  };

  //init
  $scope.getAllWorksByUserId($scope.userId);

  $scope.confirmWorksAction = function (id, name, action, e) {
    e.preventDefault();
    $scope.confirmName = name;
    $scope.isShowConfirmAction = action;
    $('#confirmInfo').modal({ backdrop: 'static', keyboard: false });

    $('#copyWorks').one('click', function () {
      console.log('copy');
      $scope.copyWorks(id);
      $('#confirmInfo').modal('hide');
      $('#cancelWorks').off();
      $('#deleteWorks').off();
    });
    $('#cancelWorks').one('click', function () {
      console.log('cancel');
      $('#confirmInfo').modal('hide');
      $('#copyWorks').off();
      $('#deleteWorks').off();
    });
    $('#deleteWorks').one('click', function () {
      console.log('delete');
      $scope.removeWorks(id);
      $('#confirmInfo').modal('hide');
      $('#copyWorks').off();
      $('#cancelWorks').off();
    });
  };

  $scope.copyWorks = function (id) {
    worksSrv.getWorksById(id).then(function (response) {
      var works = response.data;
      works.name = works.name + '-copy';
      worksSrv.initWorks(works).then(function (response) {
        var worksId = response.data;
        if (worksId) {
//          $location.path('/users/' + $scope.userId + '/works-edit/' + worksId);
          $scope.getAllWorksByUserId($scope.userId);
          console.log('copy works');
        }
      });
    });
  };

  $scope.editWorks = function (id) {
    console.log('edit works' + id);
  };

  $scope.removeWorks = function (id) {
    worksSrv.deleteWorksById(id).then(function (response) {
      if (response.data) {
        $scope.getAllWorksByUserId($scope.userId);
      }
    });
  };

  // Get all templates, start.html
  templateSrv.getTemplateList().then(function (response) {
    var result = response.data;
    if (!_.isArray(result)) {
      result = [result];
    }
    _.forEach(result, function (item) {
//      item.thumb = configConstants.URLS.baseUrl + 'templates/tpls/' + item.id + '/' + item.thumb;
      item.visitUrl = $scope.baseUrl + item.url;
      $scope.tplList.push(item);

    });
    $scope.selectedCategory = $scope.tplList;
    $scope.selectTemplate();
  });

  $scope.changeTabs = function (type) {
    if (type === 'all') {
      $scope.selectedCategory = $scope.tplList;
      $scope.selectedTab = 'all';
    } else {
      var temp = [];
      _.forEach($scope.tplList, function (item) {
        if (item.typeId === type) {
          temp.push(item);
        }
      });
      $scope.selectedCategory = temp;
      $scope.selectedTab = type;
    }
  };

  $scope.selectTemplate = function (item) {
    if(!item) {
      $scope.selectedTemplate = $scope.selectedCategory[0];
    }else{
      $scope.selectedTemplate = item;
    }
  };

  $scope.goBack = function () {
    $location.path('/users/' + $scope.userId + '/works');
  };

  $scope.confirmNext = function () {
    var tpl = $scope.selectedTemplate;
    $rootScope.worksName = $scope.worksName;
    if (tpl && $rootScope.worksName) {
      $location.path('/users/' + $scope.userId + '/works-create/' + tpl.id);
    } else {
      console.log('please choose a template and name');
    }
  };

  if (tplId) {
    templateSrv.getTemplateById(tplId).then(function (response) {

      var pages = response.data.pages;
      var index = $scope.selectedPageIndex;
      $scope.selectedPage = pages[index];
      $scope.pageWorks = response.data;
      $scope.visitUrl = $scope.baseUrl + response.data.url;
      //
      $scope.saveWorks(true);
    });
  }

  $scope.selectPage = function (index) {
    $scope.selectedPageIndex = index;
    $scope.selectedPage = $scope.pageWorks.pages[index];
    $scope.isShowEditPageName = false;
    if ($scope.selectedPage.type == 'map') {
      getCurrentMap($scope.selectedPage.address);
    }
    if ($scope.selectedPage.type == 'video') {
      var arr = $scope.selectedPage.videoUrl.split('-');
      var videoUrl = '';
      if (arr[0] == 'youku') {
        videoUrl = 'http://player.youku.com/embed/' + arr[1];
      } else {
        videoUrl = 'http://www.tudou.com/programs/view/html5embed.action?code=' + arr[1];
      }
      $scope.secVideoUrl = $sce.trustAsResourceUrl(videoUrl);
    }
  };

  var getCurrentMap = function (address) {
    // 百度地图API功能
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(address, function (point) {
      if (point) {
        var map = new BMap.Map("allMap");
        map.centerAndZoom(point, 16);
        map.addOverlay(new BMap.Marker(point));
        //reset longitude, latitude
        $scope.selectedPage.longitude = point.lng;
        $scope.selectedPage.latitude = point.lat;
        var index = $scope.selectedPageIndex;
        $scope.selectedPage.title = address;
        $scope.pageWorks.pages[index] = $scope.selectedPage;
      }
    }, "");
  };

  $scope.searchNewPlace = function (address) {
    getCurrentMap(address);
//    var index =  $scope.selectedPageIndex;
//    $scope.pageWorks.pages[index] = $scope.selectedPage;

  };

  $scope.changeVideoUrl = function (url) {
//    var youkuUrl = 'http://player.youku.com/embed/';
//    var tudouUrl = 'http://www.tudou.com/programs/view/html5embed.action?code=';
    var code = '';
    var urlPrefix = '';
    var videoUrl = '';
    if (url.indexOf('youku.com') > -1) {
      var arr = url.split('id_');
      var arr1 = arr[1].split('.');
      code = arr1[0];
      urlPrefix = 'http://player.youku.com/embed/';
      videoUrl = 'youku-' + code;
    } else if (url.indexOf('tudou.com') > -1) {
      var arr = url.split('/');
      var len = arr.length - 2;
      code = arr[len];
      urlPrefix = 'http://www.tudou.com/programs/view/html5embed.action?code=';
      videoUrl = 'tudou-' + code;
    }
    $scope.secVideoUrl = $sce.trustAsResourceUrl(urlPrefix + code);
    $scope.selectedPage.videoUrl = videoUrl;
    var index = $scope.selectedPageIndex;
    $scope.pageWorks.pages[index] = $scope.selectedPage;

  };

  $scope.changePageName = function (event, index) {
    var ele = $(event.target);
    var offset = 0;
    if (ele.hasClass('glyphicon-pencil')) {
      offset = ele.parent().parent().parent().offset();
    } else {
      offset = ele.parent().parent().offset();
    }
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
    event.cancelBubble = true;
    event.returnValue = false;

//    var elem = e.target;
//    var offset = $(elem).parent().parent().parent().offset();
    $('#editPageName').css({"top": offset.top - 40, "left": offset.left - 12}).fadeIn('slow');
    $scope.isShowEditPageName = true;
    //
    $scope.tmpPage = $scope.pageWorks.pages[index];
    $scope.pageNameIndex = index;
    //e.stopPropagation();
  };

  $scope.confirmPageName = function () {
    $scope.isShowEditPageName = false;
    var index = $scope.pageNameIndex;
    $scope.pageWorks.pages[index] = $scope.tmpPage;
    $scope.saveWorks(true);
  };

  $scope.deletePage = function (page, index) {
    worksSrv.deletePage(page, $scope.pageWorks.id).then(function (response) {
      $scope.pageWorks.pages = response.data.pages;
      $scope.selectPage(0);
      $scope.saveWorks(true);
    });
  };

  $scope.dragPage = function (index) {
//    $scope.selectedPageIndex = index;
  };

  $scope.copyCurrentPage = function () {
    var page = angular.copy($scope.selectedPage);
    var length = $scope.pageWorks.pages.length -1;
    page.index = parseInt($scope.pageWorks.pages[length].index, 10) + 1;
    worksSrv.saveCopyPage(page, $scope.pageWorks.id).then(function (response) {
      $scope.pageWorks.pages = response.data.pages;
    });
  };

  $scope.addLayer = function () {
    var page = angular.copy($scope.selectedPage);
    if (page.animateImgs && page.animateImgs.length>0) {
      var len = page.animateImgs.length - 1;
      var layer = angular.copy(page.animateImgs[len]);
      var srcImg = layer.src;
      var arr1 = srcImg.split('_');
      var arr2 = arr1[2].split('.');
      var newSrcImg = arr1[0] + '_' + arr1[1] + '_' + (++arr2[0]) + '.' + arr2[1];
      layer.src = newSrcImg;
      page.animateImgs.push(layer);
      var length = $scope.selectedPageIndex;
      $scope.selectedPage = angular.copy(page);
      $scope.pageWorks.pages[length] = $scope.selectedPage;
    }else{
      if(page.type == 'common' || page.type == 'gallery') {
        var layer = {
          "type": "fadeIn",
          "delayTime": 1000,
          "motion": "fadeIn",
          "src":  'works/'+worksId+'/images/'+page.type+'_'+$scope.selectedPageIndex+'_1.png'
        };
      }else{
        var layer = {
          "src":  'works/'+worksId+'/images/'+page.type+'_'+$scope.selectedPageIndex+'_1.jpg'
        };
      }
      page.animateImgs.push(layer);
      $scope.selectedPage = page;
      var length = $scope.selectedPageIndex;
      $scope.pageWorks.pages[length] = $scope.selectedPage;
    }
    $scope.randNumber = getRandomNumber();
    $scope.saveWorks(true);
  };

  $scope.deletePageLayer = function (index, event) {
    var ele = $(event.target);
    if (ele.hasClass('glyphicon-trash')) {
      ele = ele.parent().parent();
    } else {
      ele = ele.parent();
    }
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
    event.cancelBubble = true;
    event.returnValue = false;
    //
    var animateImgs = $scope.selectedPage.animateImgs;
    var newAnimateImgs = [];
    var delImgs = [];
    for (var i = 0; i < animateImgs.length; i++) {
      if (i !== index) {
        newAnimateImgs.push(animateImgs[i]);
      } else {
        delImgs.push(animateImgs[i].src);
      }
    }
    var idx = $scope.selectedPageIndex;
    $scope.selectedPage.animateImgs = newAnimateImgs;
    $scope.pageWorks.pages[idx] = $scope.selectedPage;
    $scope.pageWorks.delImages = delImgs;
    $scope.saveWorks(true);
  };

  // Create and Update
  $scope.saveWorks = function (inActiveAnimates, isBackTrue) {
    if (tplId) {// create works
      var works = {
        name: $rootScope.worksName,//$rootScope.worksName
        thumb: $scope.pageWorks.thumb,
        userId: $scope.userId,
        originBy: tplId,
        music: $scope.pageWorks.music,
        backgroundColor: $scope.pageWorks.backgroundColor,
        pageTitle: $scope.pageWorks.pageTitle,
        pageDescribe: $scope.pageWorks.pageDescribe,
        shareImage: $scope.pageWorks.shareImage,
        pages: $scope.pageWorks.pages
      };
      worksSrv.initWorks(works).then(function (response) {
        var worksId = response.data;
        if (worksId != 0) {
          $location.path('/users/' + $scope.userId + '/works-edit/' + worksId);
        } else {
          $location.path('/users/' + $scope.userId + '/works-create' + tplId);
        }
        if(isBackTrue) {
          $location.path('/users/' + $scope.userId + '/works');
        }

      });
    } else {// update works
      worksSrv.updateWorks($scope.pageWorks).then(function (response) {
        var saveFlag = response.data;
        if (saveFlag) {
          // save success message
          console.log("save success!");
          getWorksById(worksId);
          if (!inActiveAnimates) {
            $("#saveInfo").show().delay(1000).fadeOut('slow');
            $location.path('/users/' + $scope.userId + '/works-edit/' + worksId);
          }else{
            $location.path('/users/' + $scope.userId + '/works-edit/' + worksId);
          }
          if(isBackTrue) {
            $location.path('/users/' + $scope.userId + '/works');
          }
        }
      });
    }// end if
  };

  // edit works
  if (worksId) {
    getWorksById(worksId);
  }

  function getWorksById (worksId) {
    worksSrv.getWorksById(worksId).then(function (response) {
      var pages = response.data.pages;
      var index = $scope.selectedPageIndex;
      $scope.selectedPage = pages[index];
      $scope.pageWorks = response.data;
      $scope.worksInfo.pageTitle = response.data.pageTitle;
      $scope.worksInfo.pageDescribe = response.data.pageDescribe;
      $scope.worksInfo.backgroundColor = response.data.backgroundColor;
      $scope.worksInfo.music = response.data.music;
      $scope.worksInfo.thumb = response.data.thumb;

      // combine url
      $scope.visitUrl = $scope.baseUrl + 'works/' + response.data.id + '/' + response.data.url + '.html';
    });
  };

  $scope.changeParams = function (index, value, prop) {
    var animateImgs = $scope.selectedPage.animateImgs;
    animateImgs[index][prop] = value;
    $scope.selectedPage.animateImgs = animateImgs;
    var idx = $scope.selectedPageIndex;
    $scope.pageWorks.pages[idx] = $scope.selectedPage;
  };

  $scope.changeMultiParams = function (index, value, prop) {
    var animateImgs = new Array();
    animateImgs = angular.copy($scope.selectedPage.animateImgs);
    var selectedPage = angular.copy($scope.selectedPage);
    var src = animateImgs[index]['src'];
    var obj = {};
    if (value == '') {
      obj.type = '';
      obj.motion = '';
    } else if (value == 'fadeIn') {
      obj.type = 'fadeIn';
      obj.motion = 'fadeIn';
    } else if (value.indexOf('move') > -1) {
      obj.motion = value;
      var arr = value.split('-');
      obj.type = arr[0];
      obj.from = arr[1];
      obj.position = arr[2];
    }
    obj.src = animateImgs[index]['src'];
    obj.delayTime = animateImgs[index]['delayTime'];
    animateImgs[index] = obj;
    selectedPage.animateImgs = animateImgs;
    var idx = $scope.selectedPageIndex;
    $scope.pageWorks.pages[idx] = selectedPage;
  };

  $scope.confirmWorksInfo = function () {
    $scope.pageWorks.pageTitle = $scope.worksInfo.pageTitle;
    $scope.pageWorks.pageDescribe = $scope.worksInfo.pageDescribe;
    $scope.pageWorks.backgroundColor = $scope.worksInfo.backgroundColor;
    $scope.pageWorks.music = $scope.worksInfo.music;
    $scope.pageWorks.thumb = $scope.pageWorks.shareImage = $scope.worksInfo.thumb;
    $scope.closeWorkInfo();
  };

  $scope.openWorksInfo = function () {
    $("#mySetting").css("display", "block");
  };
  $scope.closeWorkInfo = function () {
    $("#mySetting").css("display", "none");
  };

  var getTplStyleList = function (type) {
    templateSrv.getTemplateStyleList(type).then(function (response) {
      $scope.styleList = response.data;
      setSelectedStyle($scope.styleList);
    });
  };

  var setSelectedStyle = function(list) {
    var type = $scope.selectedPage.type;
    _.forEach(list, function (item) {
      if(item.id == type) {
        $scope.selectedStyle = item;
      }
    });
  };

  $scope.changeTplStyle = function () {
    var type = 'content';
    if ($scope.selectedPage.type == 'clickOpenUpdown' ||
      $scope.selectedPage.type == 'clickOpenLeftRight' ||
      $scope.selectedPage.type == 'wipeScreen' ||
      $scope.selectedPage.type == 'xxx') { //TODO
      type = 'start';
    }
    getTplStyleList(type);
    $scope.openTplStylePage();
  };

  $scope.openTplStylePage = function () {
    $("#tplStyle").css("display", "block");
//    $scope.selectedStyle = null;
  };
  $scope.closeTplStylePage = function () {
    $("#tplStyle").css("display", "none");
  };

  $scope.selectStyle = function (item) {
    $scope.selectedStyle = item;
  };

  $scope.confirmStyle = function () {
    var style = $scope.selectedStyle;
    if (style) {
      if(style.type != $scope.selectedPage.type) {
        templateSrv.getTemplateStyleById(style.id).then(function (response) {
          var styleEntity = response.data;
          var index = $scope.selectedPageIndex;
          styleEntity = convertStyleImgPath(styleEntity);
          $scope.selectedPage = styleEntity;
          $scope.pageWorks.pages[index] = styleEntity;
          $scope.closeTplStylePage();
          //
          if (styleEntity.type == 'map') {
            getCurrentMap(styleEntity.address);
          }
          if (styleEntity.type == 'video') {
            var arr = styleEntity.videoUrl.split('-');
            var videoUrl = '';
            if (arr[0] == 'youku') {
              videoUrl = 'http://player.youku.com/embed/' + arr[1];
            } else {
              videoUrl = 'http://www.tudou.com/programs/view/html5embed.action?code=' + arr[1];
            }
            $scope.secVideoUrl = $sce.trustAsResourceUrl(videoUrl);
          }
          // save works
          $scope.saveWorks(true);
        });
      }else{
        console.log('select the same style');
        $scope.closeTplStylePage();
      }
    } else {
      console.log('please choose a style');
      return;
    }
  };

  // convert to standard image name, type_pageNum_index.jpg
  var convertStyleImgPath = function (style) {
    var obj = {};
    obj.index = $scope.selectedPageIndex;
    obj.name = $scope.selectedPage.name;
    obj.type = style.type;
    obj.size = style.size;
    if (style.background) {
      obj.background = style.background;
    }
    if (style.effect) {
      obj.effect = style.effect;
    }
    if (style.animateImgs) {
      obj.animateImgs = style.animateImgs;
    }
    if (style.imgSrc) {
      obj.imgSrc = style.imgSrc;
    }
    if (style.type == 'map') {
      obj.button = style.button;
      obj.buttonX = style.buttonX;
      obj.buttonY = style.buttonY;
      obj.title = style.title;
      obj.address = style.address;
      obj.longitude = style.longitude;
      obj.latitude = style.latitude;
    }
    if (style.type == 'video') {
      obj.videoButton = style.videoButton;
      obj.videoScreenshot = style.videoScreenshot;
      obj.verticalPosition = style.verticalPosition;
      obj.videoUrl = style.videoUrl;
    }
    return obj;

  };

  /*
   Upload content
   **/
  var uploader = $scope.uploader = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderThumb = $scope.uploaderThumb = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderMusic = $scope.uploaderMusic = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderTipImg = $scope.uploaderTipImg = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderBg = $scope.uploaderBg = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderMapBtn = $scope.uploaderMapBtn = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderVideoCover = $scope.uploaderVideoCover = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderPlayBtn = $scope.uploaderPlayBtn = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  var uploaderStart = $scope.uploaderStart = new FileUploader({
    url: $scope.apiUrl + 'fileUpload',
    formData: [
      {
        userId: $scope.userId
      }
    ]
  });

  uploader.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploader, $scope.uploaderItemSrc, 'pages-animateImgs')
  };
  uploader.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  uploaderThumb.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderThumb, $scope.worksInfo.thumb, 'thumb')
  };
  uploaderThumb.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  $scope.musicProgress = 0;
  $scope.musicSuccess = undefined;
  uploaderMusic.onProgressItem = function(fileItem, progress) {
    $scope.musicProgress = progress;
    console.info('onProgressItem', fileItem, progress);
  };

  uploaderMusic.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.musicProgress = 0;
    $scope.musicSuccess = undefined;
    $scope.fileUpload(uploaderMusic, $scope.worksInfo.music.name, 'music')
  };
  uploaderMusic.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    $scope.musicSuccess = false;
    if(response.indexOf('文件上传成功') > -1) {
      $scope.musicSuccess = true;
      $scope.musicProgress = 110;
      changeImagePath();
    }
  };

  uploaderTipImg.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderTipImg, $scope.selectedPage.tipImg, 'pages-tipImg')
  };
  uploaderTipImg.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  uploaderBg.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderBg, $scope.selectedPage.background, 'pages-background')
  };
  uploaderBg.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  uploaderMapBtn.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderMapBtn, $scope.selectedPage.button, 'pages-button')
  };
  uploaderMapBtn.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  uploaderVideoCover.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderVideoCover, $scope.selectedPage.videoScreenshot, 'pages-videoScreenshot')
  };
  uploaderVideoCover.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  uploaderPlayBtn.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderPlayBtn, $scope.selectedPage.videoButton, 'pages-videoButton')
  };
  uploaderPlayBtn.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

  uploaderStart.onAfterAddingFile = function (fileItem) {
    console.info('onAfterAddingFile', fileItem);
    $scope.fileUpload(uploaderStart, $scope.selectedPage.imgSrc, 'pages-imgSrc')
  };
  uploaderStart.onCompleteItem = function (fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    changeImagePath();
  };

//  console.info('uploader', uploader);
  $scope.fileUpload = function (itemInstance, fileSrc, place) {
    var start = fileSrc.lastIndexOf('/');
//    var end = fileSrc.lastIndexOf('.');
    var name = fileSrc.substring(start + 1);
    if (fileSrc.indexOf('styles') > 0 && fileSrc.indexOf('thumb') < 0) {
      name = $scope.selectedPage.type + '_' + $scope.selectedPageIndex + '_' + name;
    }
    //replace name, used specified name
    var len = itemInstance.queue.length - 1;
    var item = itemInstance.queue[len];
    item.file.name += ';' + name;
    //find the node place
    $scope.place = place;
    $scope.uploadFileName = item.file.name;
    item.upload();
    // reset queue
    itemInstance.queue = [];
  };

  var changeImagePath = function () {
    var doubleNames = $scope.uploadFileName.split(';');
    var name1 = doubleNames[0].split('.');
    var name2 = doubleNames[1].split('.');
    var newValue = '';
    newValue = 'tmp/' + $scope.userId + '/' + name2[0] + '.' + name1[1];
//    var newValue = 'tmp/' + $scope.userId + '/' + $scope.uploadFileName;
    var props = $scope.place.split('-');
    if (props[0] == 'pages') {
      if (props[1] == 'animateImgs') {
//        var idx = props[2];
//        var name = $scope.uploadFileName;
//        var start = name.lastIndexOf('_');
//        var end = name.lastIndexOf('.');
//        var idx = name.substring(start + 1, end);
        var idx = $scope.uploaderIndex;
        $scope.selectedPage.animateImgs[idx].src = newValue;
      } else {
        var prop = props[1];
        $scope.selectedPage[prop] = newValue;
      }
      var index = $scope.selectedPageIndex;
      $scope.pageWorks.pages[index] = $scope.selectedPage;
    } else if (props[0] == 'music') {
      $scope.pageWorks.music.name = newValue;
      $scope.pageWorks.music.displayName = name1[0];
      $scope.pageWorks.music.hasMusic = true;
    } else {
      var prop = props[0];
      if (prop == 'thumb') {
        $scope.worksInfo.thumb = $scope.worksInfo.shareImage = newValue;
      }
      if (prop == 'music') {
        $scope.worksInfo.music.src = newValue;
        $scope.worksInfo.music.hasMusic = true;
      }
//      $scope.pageWorks[prop] = newValue;
    }
    $scope.randNumber = getRandomNumber();
  };

  $scope.changeUploaderIndex = function (idx, itemSrc) {
    $scope.uploaderIndex = idx;
    $scope.uploaderPageIndex = $scope.selectedPageIndex;
    $scope.uploaderItemSrc = itemSrc;
  };

  var getRandomNumber = function () {
    return '?' + $window.Math.random();
  };
  $scope.randNumber = getRandomNumber();

  /**
   * jQuery options
   */
  $scope.toggleArea = function (on) {
    if (on) {
      $('.dropdown-menu-rcode').show();
    } else {
      $('.dropdown-menu-rcode').hide();
    }
  };

  $scope.toggleQrCode = function (index, on) {
    $scope.isShowQrCodeIndex = index;
    $scope.isShowQrCode = on;
  };

  $scope.cancelBack = function() {
    worksSrv.getWorksById(worksId).then(function (response) {
      result = response.data;
      $location.path('/users/' + $scope.userId + '/works');
    });
  }

  $scope.confirmBackAction = function () {
//    e.preventDefault();
    $('#confirmBack').modal({ backdrop: 'static', keyboard: false });

    $('#backAndSave').one('click', function () {
      console.log('yes');
      $scope.saveWorks(true, true);
      $('#confirmBack').modal('hide');
      $('#backAndCancel').off();
    });
    $('#backAndCancel').one('click', function () {
      console.log('No');
      $scope.cancelBack();
      $('#confirmBack').modal('hide');
      $('#backAndSave').off();
    });
  };

});