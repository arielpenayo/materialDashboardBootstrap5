(function(){
    'use strict';

    angular
        .module('app')
        .controller('categoriaFormCtrl', categoriaFormCtrl)

    categoriaFormCtrl.$inject = ['dataService','toastr','$state','$stateParams'];

    function categoriaFormCtrl(dataService,toastr,$state,$stateParams) {
        /* jshint validthis:true */
        var vm = this;

        vm.categoria = {};
        vm.editMode = $state.current.name === 'categoria-editar' ? true : false;
        vm.subtitle = $state.current.params.subtitle;

        vm.formFields = [{
          className:'row',
          fieldGroup:[
            {
              className: 'col-md-6',
              key: 'categoriaDenominacion',
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

        function findCategoriaById() {
          return dataService.findByPk('categoria', $stateParams.id)
          .then(function(result) {
              return result;
          })
          .finally(function() {
              vm.dataLoading = false;
          });
        } 
        function activate() { 
          if($stateParams.id) {
            vm.dataLoading = true;
            findCategoriaById()
              .then(function(result) {
                  if (result.success) {
                      console.log('result.data :>> ', result.data);
                      vm.categoria = result.data;
                  } else {
                     console.log('Error en findCategoriaById');
                  }
              });
         }
        }

        vm.grabar = function (categoria) {
            vm.dataSaving = true;

            
            if ($stateParams.id) {
              dataService.update('categoria',$stateParams.id, categoria)  
              .then(function(result) {
                  if (result.success) {
                      toastr.success('Categoría actualizado con éxito', 'Aviso');
                      $state.go('app.maestros.categorias');
                  } else {
                      toastr.error(result.message, 'Aviso');
                  }
              })
              .finally(function() {
                  vm.dataSaving = false;
              });
            }else{
              dataService.create('categoria', categoria)  
                  .then(function(result) {
                      if (result.success) {
                          toastr.success('Categoría grabada con éxito', 'Aviso');
                          $state.go('app.maestros.categorias');
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