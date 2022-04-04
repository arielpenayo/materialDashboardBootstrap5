(function(){
    'use strict';

    angular
        .module('app')
        .controller('registerCtrl', registerCtrl)

    registerCtrl.$inject = ['dataService','$location','$auth','$rootScope','$state','toastr','md5'];

    function registerCtrl(dataService,$location, $auth, $rootScope,$state,toastr,md5) {
        
        var vm = this;
        vm.userFields = [
            {
                key: 'usuarioNombreApellido',
                type: 'input',
                templateOptions: {
                    label: '',
                    placeholder: 'Nombre y Apellido',
                    required: true
                }
            },
            {
                key: 'usuarioCorreo',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: '',
                    placeholder: 'Correo',
                    required: true
                }
            },
            {
                key: 'usuarioContrasenha',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: '',
                    placeholder: 'Contraseña',
                    required: true
                }
            },
            {
                key: 'password2',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: '',
                    placeholder: 'Contraseña',
                    required: true
                }
            },
            {
                
                key: 'usuarioCategoria',
                type: "select",
                defaultValue:'',
                templateOptions: {
                    label: 'Categoría',
                    placeholder: 'Categoría',
                    notNull: true,
                    required: true,
                    options: [

                        {name: 'Ahorrador', value: 1},
                        {name: 'Economista', value: 3},
                    ]
                },
            },

        ];

        vm.registrar = function (usuario) {
            let usuarioCopia = angular.copy(usuario)

            if (usuarioCopia.usuarioContrasenha !== usuarioCopia.password2) { 
                console.log("first")
                toastr.warning('Las contraseñas deben de coincidir', 'Aviso');
                return;
            }
            usuarioCopia.usuarioContrasenha = md5.createHash(usuarioCopia.usuarioContrasenha);
            
            vm.dataSaving = true;

            
              dataService.create('usuario', usuarioCopia)  
                  .then(function(result) {
                      if (result.success) {
                          toastr.success('Usuario registrado con éxito', 'Aviso');
                          $state.go('appSimple.login');
                      } else {
                          toastr.error(result.message, 'Aviso');
                      }
                  })
                  .finally(function() {
                      vm.dataSaving = false;
                  });
            
              
            
        } 

      
    }
})();