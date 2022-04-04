(function(){
    'use strict';

    angular
        .module('app')
        .controller('cuentasCtrl', cuentasCtrl)

    cuentasCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$stateParams'];

    function cuentasCtrl(dataService,toastr,$scope,$uibModal,$stateParams) {
        /* jshint validthis:true */
        const vm = this;
        let dialog = {};
        vm.cuentas = []

        activate();

        vm.eliminar = function(cuentaUsuarioId) {
			var datos = {
				cuentaUsuarioId: cuentaUsuarioId
			};

			dialog = $uibModal.open({
                templateUrl: '../../views/common/modal.html',
				controller: ['entidad', activateModal2Ctrl],
				controllerAs: 'vm',
				resolve: {
					entidad: function() {
						return datos;
					},
				},
			});
        };
       
        
        function activateModal2Ctrl(datos) {
            var vm = this;


			vm.confirmar = confirmar;
			var mensaje = 'Categoría eliminada con éxito!';
			vm.titulo = 'Pedido de confirmación';

            vm.mensaje = 'Deseas eliminar la Categoría?';
			
			
			function confirmar() {
                vm.dataSaving = true;
                
				return dataService
					.delete('categoria', datos.cuentaUsuarioId)
					.then(function(result) {
						if (result.success) { 

                            toastr.success(mensaje, 'Aviso');
                            vm.dataSaving = false;
							dialog.close();
                            activate()
                    
                            
						} else {
                            toastr.error(result.message, 'Aviso');
							dialog.close();
						}
					})
                   .catch(function(err){
                       console.log('err :>> ', err);
                       toastr.error(err, 'Aviso');
                        dialog.close();
                   })
			}
		}

        function activate() { 
            getCuentasUsuario();
        }

        function getCuentasUsuario() {
            vm.dataLoading = true;
            return dataService.findAllByFilter("usuario-cuenta-filter",{usuarioId:$stateParams.id})
                .then(function(result) { 

                    
                    if (result.success) {
                        vm.cuentas = result.data;    
                    } else {
                        toastr.error(result.message,'Error');
                    }
                })
                .finally(function() {
                    vm.dataLoading = false;
                });
        }
    }
})();