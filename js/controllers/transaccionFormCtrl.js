(function(){
    'use strict';

    angular
        .module('app')
        .controller('transaccionFormCtrl', transaccionFormCtrl)

    transaccionFormCtrl.$inject = ['dataService','toastr','$state','$stateParams','$auth'];

    function transaccionFormCtrl(dataService,toastr,$state,$stateParams,$auth) {
        /* jshint validthis:true */
        var vm = this;

        vm.transaccion = {};
        vm.editMode = $state.current.name === 'transaccion-editar' ? true : false;
        vm.subtitle = $state.current.params.subtitle;
        vm.premium = false 
        vm.formFields = [{
          className:'row',
          fieldGroup:[
            {
                className: 'col-md-11',
                key: 'transaccionMonto',
                type: 'input',
                templateOptions: {
                    type: 'number',
                    label: 'Monto  G$',
                    placeholder: 'Monto  G$',
                    min: 0,
                    step: 1,
                    required: true
                }
            },
            {
                className: 'col-md-11',
                key: 'transaccionFecha',
                type: 'input',
                defaultValue: moment().toDate(),
                templateOptions: {
                    label: 'Fecha Movimiento',
                    type: 'date',
                    datepickerPopup: 'dd-MM-yyyy',
                    required: true
                }
            },	
            {
                className: 'col-md-11',
                key: "usuarioCuentaId",
                type: "ui-select-single",
                templateOptions: {
                    optionsAttr: 'bs-options',
                    ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
                    valueProp: 'usuarioCuentaId',
                    labelProp: 'usuarioCuentaDescripcion',
                    label: 'Cuenta',
                    placeholder: 'Cuenta',
                    required: true,
                    options: []
                },
                controller: function($scope, dataService) {
               
                        
                    $scope.to.loading = dataService.findAllByFilter('usuario-cuenta-filter',{usuarioId:vm.usuario.usuarioId}).then(function(result) {
                        if (result.success) {
                            $scope.to.options = result.data;
                            return result.data;
                        } else {
                            return false;
                        }
                    });
                 
                }
            },
            {
                className: 'col-md-11',
                key: "categoriaId",
                type: "ui-select-single",
                templateOptions: {
                    optionsAttr: 'bs-options',
                    ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
                    valueProp: 'categoriaId',
                    labelProp: 'categoriaDenominacion',
                    label: 'Categoría',
                    placeholder: 'Categoría',
                    required: true,
                    options: []
                },
                controller: function($scope, dataService) {
                    if (vm.premium) {
                        
                        $scope.to.loading = dataService.findAllByFilter('categoria-filter',{categoriaEstado:{$in:[1,2,3]}}).then(function(result) {
                            if (result.success) {
                                $scope.to.options = result.data;
                                return result.data;
                            } else {
                                return false;
                            }
                        });
                    }else{

                        $scope.to.loading = dataService.findAllByFilter('categoria-filter',{categoriaEstado:{$in:[1,3]}}).then(function(result) {
                            if (result.success) {
                                $scope.to.options = result.data;
                                return result.data;
                            } else {
                                return false;
                            }
                        });
                    }
                }
            },
            {
              className: 'col-md-6',
              key: 'transaccionObservacion',
              type: 'input',
              templateOptions: {
                type: 'input',
                placeholder: 'Observación',
                required: true
              }
            },
          
          ]
        }
          
          
        ];

        activate();

        function findTransaccionById() {
          return dataService.findByPk('transaccion', $stateParams.id)
          .then(function(result) {
              return result;
          })
          .finally(function() {
              vm.dataLoading = false;
          });
        } 
        function activate() { 
            vm.usuario = $auth.getPayload()
          if($stateParams.id) {
            vm.dataLoading = true;
            findTransaccionById()
              .then(function(result) {
                  if (result.success) {
                      console.log('result.data :>> ', result.data);
                      result.data.transaccionFecha = moment(result.data.transaccionFecha).toDate()
                      result.data.transaccionMonto = +result.data.transaccionMonto
                      vm.transaccion = result.data;
                  } else {
                     console.log('Error en findTransaccionById');
                  }
              });
         }
        }

        vm.grabar = function (transaccion) {
            vm.dataSaving = true;

            let datos = {
                ...transaccion,
                usuarioId:vm.usuario.usuarioId
            }
            
            if ($stateParams.id) {
              dataService.update('transaccion',$stateParams.id, datos)  
              .then(function(result) {
                  if (result.success) {
                      toastr.success('Transacción actualizado con éxito', 'Aviso');
                      $state.go('app.transacciones');
                  } else {
                      toastr.error(result.message, 'Aviso');
                  }
              })
              .finally(function() {
                  vm.dataSaving = false;
              });
            }else{
              dataService.create('transaccion', datos)  
                  .then(function(result) {
                      if (result.success) {
                          toastr.success('Transacción grabada con éxito', 'Aviso');
                          $state.go('app.transacciones');
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