// Default colors
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

angular
.module('app', [
  'ui.router',
  'ncy-angular-breadcrumb',
  'angular-loading-bar',
  'ui.select',
  'ui.calendar',
  'ngSanitize',
  'oc.lazyLoad',
  'formly',
  'formlyBootstrap',
  'satellizer',
  'toastr',
  'ui.bootstrap',
  'angular-md5',
  'ui.grid',
  'ui.grid.selection',
  'ui.grid.grouping',
  'ng-currency',
  'ngSidebarJS',
  'ngStorage',
  'naif.base64',
  'angular-uuid'
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 1;
}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$on('$stateChangeSuccess',function(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $rootScope.$state = $state;
  return $rootScope.$stateParams = $stateParams;
}]);
