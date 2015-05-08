Site.constant('configConstants', (function () {

  var _appVersion = "1.12.0";
  var _build = "2014-11-18";
  var _STTIenv = 'STG';  //STG or PRD

  var _stageURLs = {
    apiUrl: 'http://localhost/bajiaoye-services/',
    baseUrl: 'http://localhost/bajiaoye-services/'
  };

  var _prodURLs = {
    apiUrl: 'http://localhost'
  };

  return {
    appVersion: _appVersion,
    build: _build,
    URLS: (_STTIenv == 'STG') ? _stageURLs : _prodURLs
  }
})());

