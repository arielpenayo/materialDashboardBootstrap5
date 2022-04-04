(function(){
    'use strict';

    angular
        .module('app')
        .controller('sidebarCtrl', sidebarCtrl)

    sidebarCtrl.$inject = ['$location','$auth','$rootScope','$state','toastr'];

    function sidebarCtrl($location, $auth, $rootScope,$state,toastr) {
        
        var vm = this;
        activate()
        // vm.esAdmin = false;
        function activate () {
            vm.esAdmin = true;
            return false
            if ($auth.getPayload()?.appuserNivel == undefined) {
                vm.esAdmin = false
            }
             vm.esAdmin = ($auth.getPayload().appuserNivel == 1 ? true : false)
        }
    }
})();