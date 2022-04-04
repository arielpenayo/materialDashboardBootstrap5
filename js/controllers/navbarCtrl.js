(function(){
    'use strict';

    angular
        .module('app')
        .controller('navbarCtrl', navbarCtrl)

    navbarCtrl.$inject = ['$location','$auth','$rootScope','$state','toastr'];

    function navbarCtrl($location, $auth, $rootScope,$state,toastr) {
        /* jshint validthis:true */
        var vm = this;
        vm.usuarioNombre = ''
        activate()
        
        function activate() {
            // vm.usuarioNombre = $auth.getPayload().appuserNombre
        }
        vm.logout = function () {

            $auth.logout();
            delete $rootScope.aclData;
            $state.go('login');
            toastr.info('Sesión finalizada', 'Logout');
            $state.go('appSimple.login');

        }
    }
})();