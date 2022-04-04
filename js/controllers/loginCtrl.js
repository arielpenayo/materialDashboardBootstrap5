(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginCtrl', loginCtrl)

    loginCtrl.$inject = ['dataService', '$rootScope', 'toastr', '$uibModal', '$state', 'md5', '$auth','config'];

    function loginCtrl(dataService, $rootScope, toastr, $uibModal, $state, md5, $auth,config) {

        var vm = this;
        vm.dataLoading;

        vm.user = {};

        vm.userFields = [
            // {
            //     key: 'login',
            //     type: 'input',
            //     templateOptions: {
            //         label: '',
            //         placeholder: 'Usuario',
            //         required: true
            //     }
            // },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: '',
                    placeholder: 'Correo',
                    required: true
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: '',
                    placeholder: 'Contraseña',
                    required: true
                }
            }

        ];

        activate();
        vm.goToRegister = function () {
            $state.go('appSimple.register');

        }

        vm.login = function (user) {
            $state.go('app.main');
            // return false

            var userCopy = angular.copy(user);
            var hash = md5.createHash(userCopy.password);
            userCopy.password = hash;

            $auth.login(userCopy, {method: 'POST',headers: {
                'Content-Type': 'application/json',
                'ApiToken':(moment().format('DD-MM-YYYY HH')).toString(),
                'ApiHash': md5.createHash((moment().format('DD-MM-YYYY HH')).toString()+ config.key)
            }})
            .then(function (token) {
                $auth.setToken(token)
                if (token.status == '200') {
                    $state.go('app.main');
                    toastr.success('Usuario logueado', 'Login');
                } else {
                    console.log("Error usuario");
                }
            })
            .catch(function (response) {
                if(response.data === null) {
                    toastr.error('Error de conexion', 'Aviso');
                } else {
                    console.log('response :>> ', response);
                    toastr.error('Your credentials are gone', 'Error');
                }
            });


        }


        function activate() {
            console.log(`config`, config)
            $auth.logout();
            delete $rootScope.aclData;
            $state.go('login');
        }
    }
})();





