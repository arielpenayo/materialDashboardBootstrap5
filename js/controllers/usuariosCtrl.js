(function () {
    'use strict';

    angular
        .module('app')
        .controller('usuariosCtrl', usuariosCtrl)

    usuariosCtrl.$inject = ['dataService', '$uibModal', 'toastr',  '$state'];

    function usuariosCtrl(dataService, $uibModal, toastr,  $state) {
        var vm = this;
        var dialog;
        vm.dataLoading = false;
        vm.usuarios = [];

        activate();

        vm.cambiarEstado = function (id, operacion) {
            var datos = {
                id: id,
                operacion: operacion
            }
            dialog = $uibModal.open({
                templateUrl: '../../views/common/modal.html',
                controller: ['entidad', activateModalCtrl],
                controllerAs: 'vm',
                resolve: { entidad: function () { return datos; } }
            });
        }

        vm.goTo = function (ruta, appuserId) {
            if (appuserId) {
                $state.go(ruta, { id: appuserId, previousState: { name: $state.current.name } });
            } else {
                $state.go(ruta, { previousState: { name: $state.current.name } });
            }
        }

        function activateModalCtrl(datos) {
            var vm = this;
            var mensaje = datos.operacion === "anular" ? "Registro desactivado con éxito!" : "Registro activado con éxito!";
            vm.confirmar = confirmar;
            var actualizacion;

            vm.titulo = 'Pedido de confirmación';
            if (datos.operacion === "desactivar") {
                vm.mensaje = 'Deseas desactivar este registro?';
                actualizacion = { appuserEstado: 0 }

            } else if (datos.operacion === "activar") {
                vm.mensaje = 'Deseas activar este registro?';
                actualizacion = { appuserEstado: 1 }
            }


            function confirmar() {
                return dataService.update('appuser', datos.id, actualizacion)
                    .then(function (result) {
                        if (result.success) {
                            activate();
                            dialog.close();
                            toastr.success(mensaje, 'Aviso');
                        } else {
                            dialog.close();
                            toastr.error(result.message, 'Aviso');
                        }
                    });
            }
        }

        function findAll() {
            return dataService.findAll('appuser-ext')
                .then(function (result) {
                    return result;
                })
                .finally(function () {
                    vm.dataLoading = false;
                })
        }

        function activate() {
            vm.dataLoading = true;
            findAll()
                .then(function (result) {
                    if (result.success) {
                        vm.usuarios = result.data;
                    } else {
                        console.log('Error al obtener Usuarios');
                    }
                })
        }

    }
})();