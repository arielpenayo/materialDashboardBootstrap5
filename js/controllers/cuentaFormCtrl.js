(function(){
    'use strict';

    angular
        .module('app')
        .controller('cuentaFormCtrl', cuentaFormCtrl)

    cuentaFormCtrl.$inject = ['dataService','toastr','$state','$stateParams','$auth'];

    function cuentaFormCtrl(dataService,toastr,$state,$stateParams,$auth) {
        /* jshint validthis:true */
        var vm = this;

        vm.cuenta = {};
        vm.editMode = $state.current.name === 'cuenta-editar' ? true : false;
        vm.subtitle = $state.current.params.subtitle;
        vm.usuario = {}

        vm.formFields = [{
          className:'row',
          fieldGroup:[
            {
              className: 'col-md-6',
              key: 'usuarioCuentaDescripcion',
              type: 'input',
              templateOptions: {
                type: 'input',
                placeholder: 'Denominación',
                required: true
              }
            },
          
          ]
        }
          
          
        ];

        activate();

        function findCuentaById() {
          return dataService.findByPk('usuario-cuenta', $stateParams.id)
          .then(function(result) {
              return result;
          })
          .finally(function() {
              vm.dataLoading = false;
          });
        } 
        function activate() { 
            console.log('$auth.getPayload()', $auth.getPayload())
          vm.usuario = $auth.getPayload()
          if($stateParams.id) {
            vm.dataLoading = true;
            findCuentaById()
              .then(function(result) {
                  if (result.success) {
                      console.log('result.data :>> ', result.data);
                      vm.cuenta = result.data;
                  } else {
                     console.log('Error en findCuentaById');
                  }
              });
         }
        }

        vm.grabar = function (cuenta) {
            let datos =  {
                ...cuenta,
                usuarioId:vm.usuario.usuarioId
            }
            vm.dataSaving = true;

            
            if ($stateParams.id) {
              dataService.update('usuario-cuenta',$stateParams.id, datos)  
              .then(function(result) {
                  if (result.success) {
                      toastr.success('Cuenta actualizada con éxito', 'Aviso');
                      $state.go('app.maestros.cuentas');
                  } else {
                      toastr.error(result.message, 'Aviso');
                  }
              })
              .finally(function() {
                  vm.dataSaving = false;
              });
            }else{
              dataService.create('usuario-cuenta', datos)  
                  .then(function(result) {
                      if (result.success) {
                          toastr.success('Cuanta grabada con éxito', 'Aviso');
                          $state.go('app.maestros.cuentas');
                      } else {
                          toastr.error(result.message, 'Aviso');
                      }
                  })
                  .finally(function() {
                      vm.dataSaving = false;
                  });
            }
              
            
        } 
    }
})();