(function(){
    'use strict';

    angular
        .module('app')
        .controller('categoriasCtrl', categoriasCtrl)

    categoriasCtrl.$inject = ['dataService','toastr','$scope','$uibModal'];

    function categoriasCtrl(dataService,toastr,$scope,$uibModal) {
        /* jshint validthis:true */
        const vm = this;
        let dialog = {};
        vm.categorias = []

        activate();

        vm.eliminar = function(categoriaId) {
			var datos = {
				categoriaId: categoriaId
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
					.delete('categoria', datos.categoriaId)
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
            getCategorias();
        }

        function getCategorias() {
            vm.dataLoading = true;
            return dataService.findAllByFilter("categoria-filter",{categoriaEstado:1})
                .then(function(result) { 

                    
                    if (result.success) {
                        vm.categorias = result.data;    
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