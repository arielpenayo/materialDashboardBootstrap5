(function(){
    'use strict';

    angular
        .module('app')
        .controller('transaccionesCtrl', transaccionesCtrl)

    transaccionesCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$auth'];

    function transaccionesCtrl(dataService,toastr,$scope,$uibModal,$auth) {
        /* jshint validthis:true */
        const vm = this;
        let dialog = {};
        vm.transacciones = []

        activate();

        vm.eliminar = function(transaccionId) {
			var datos = {
				transaccionId: transaccionId
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
			var mensaje = 'Transacción eliminada con éxito!';
			vm.titulo = 'Pedido de confirmación';

            vm.mensaje = 'Deseas eliminar la Transacción?';
			
			
			function confirmar() {
                vm.dataSaving = true;
                
				return dataService
					.delete('transaccion', datos.transaccionId)
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
            vm.usuario = $auth.getPayload()
            getTransacciones();
        }

        function getTransacciones() {
            vm.dataLoading = true;
            return dataService.findAllByFilter("transaccion-ext-filter",{usuarioId:vm.usuario.usuarioId})
                .then(function(result) { 

                    
                    if (result.success) {
                        vm.transacciones = result.data;    
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