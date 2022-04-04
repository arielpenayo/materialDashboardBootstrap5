// const moment = require("moment");

(function () {
    'use strict';

    angular
        .module('app')
        .controller('usuarioFormCtrl', usuarioFormCtrl)

    usuarioFormCtrl.$inject = ['dataService', '$state', '$stateParams', 'md5', 'toastr'];

    function usuarioFormCtrl(dataService, $state, $stateParams, md5, toastr) {
        var vm = this;
        vm.usuario = {};
        vm.dataLoading = false;
        // etc
        vm.dataSaving = false;
        vm.hide = true;
        vm.editMode = false;
        vm.banderaTemporal = true;
        vm.subtitle = $state.current.params.subtitle;
        activate();

        vm.cancelar = function () {
            $state.go('app.maestros.usuarios');
        }

        vm.grabar = function (usuario) {
            vm.dataSaving = true;
            let data = {};

            if (vm.banderaTemporal) {
                var userCopy = angular.copy(usuario);
                var hash = md5.createHash(userCopy.appuserContrasena);

                userCopy.appuserContrasena = hash;

                data = {
                    appuserEmail: usuario.appuserEmail,
                    appuserNombre: usuario.appuserNombre,
                    appuserEstado: 1,
                    appuserCreadoPor: 1,
                    appuserRolId: usuario.appuserRolId,
                    appuserLogin: usuario.appuserLogin,
                    appuserContrasenaTemporal: 1,
                    appuserContrasena: userCopy.appuserContrasena
                }
            } else {
                data = {
                    appuserEmail: usuario.appuserEmail,
                    appuserNombre: usuario.appuserNombre,
                    appuserEstado: 1,
                    appuserCreadoPor: 1,
                    appuserRolId: usuario.appuserRolId,
                    appuserLogin: usuario.appuserLogin
                }
            }

            if ($stateParams.id) {
                // Editar
                dataService.update('appuser', $stateParams.id, data)
                    .then(function (result) {
                        if (result.success) {
                            toastr.success('Se ha editado con exito!');
                            $state.go('app.maestros.usuarios');
                        } else {
                            toastr.error(result.message, 'Aviso')
                        }
                    })
                    .catch(function (error) {
                        return error
                    })
                    .finally(function () {
                        vm.dataSaving = false;
                    });
            } else {
                // Registrar
                dataService.create('appuser', data)
                    .then(function (result) {
                        if (result.success) {
                            toastr.success('Se ha registrado con exito!');
                            $state.go('app.maestros.usuarios');
                        } else {
                            toastr.error(result.message, 'Aviso')
                        }
                    })
                    .catch(function (error) {
                        return error;
                    })
                    .finally(function () {
                        vm.dataSaving = false;
                    });
            }

        }
        // Buscar por Id para rellenar los campos
        function getById() {
            return dataService.findById('appuser', $stateParams.id)
                .then(function (result) {

                    return result;
                })
                .finally(function () {
                    vm.dataLoading = false;
                });
        }

        function activate() {
            vm.dataLoading = true;

            if ($state.current.name === 'app.maestros.usuarioEditar') {
                vm.editMode = true;
                if ($stateParams.id) {
                    getById()
                        .then(function (result) {
                            if (result.success) {
                                console.log('result', result)
                                vm.usuario.appuserEmail = result.data.appuserEmail;
                                vm.usuario.appuserNombre = result.data.appuserNombre;
                                vm.usuario.appuserRolId = result.data.appuserRolId;
                                vm.usuario.appuserLogin = result.data.appuserLogin;
                                vm.banderaTemporal = result.data.appuserContrasenaTemporal == 0 ? false : true;
                            } else {
                                toastr.warning(result.message, 'Aviso')
                            }
                        });
                } else {
                    vm.dataLoading = false;
                }
            }
            // Verifica si esta en editar o registrar y oculta campos con el hideExpression
            vm.usuarioFields = [{
                className: 'row',
                fieldGroup: [
                    {
                        className: 'col-md-12',
                        key: "appuserLogin",
                        type: "input",
                        templateOptions: {
                            type: "input",
                            label: "Nombre de usuario",
                            placeholder: "Nombre de usuario",
                            required: true
                        },
                        "expressionProperties": {
                            "templateOptions.disabled": `${vm.editMode}`
                        },
                        validators:{
                            appuserLogin:function($viewValue,$modelValue) {
                              var value = $modelValue || $viewValue;
                              return !value || /^[a-zA-Z0-9]{3,30}$/.test(value)
                            }
                        }
                    },
                    {
                        className: 'col-md-12',
                        key: "appuserNombre",
                        type: "input",
                        templateOptions: {
                            type: "input",
                            label: "Nombre y apellido",
                            placeholder: "Nombre y apellido",
                            required: true
                        },
                        "expressionProperties": {
                            "templateOptions.disabled": `${vm.editMode}`
                        },
                    },
                    {
                        className: 'col-md-12',
                        key: "appuserEmail",
                        type: "input",
                        templateOptions: {
                            type: "input",
                            label: "Email",
                            placeholder: "Email",
                            required: false
                        },
                        // "expressionProperties": {
                        //     "templateOptions.disabled": `${vm.editMode}`
                        // },
                    },
                    {
                        className: 'col-md-12',
                        key: "appuserRolId",
                        type: "select",
                        templateOptions: {
                            // optionsAttr: 'bs-options',
                            // ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
                            notNull: true,
                            label: 'Rol',
                            placeholder: 'Seleccione un rol',
                            valueProp: 'appuserRolId',
                            labelProp: 'appuserRolDenominacion',
                            required: true,
                            options: []
                        },
                        controller: function ($scope, dataService) {
                            $scope.to.loading = dataService.findAllByFilter('appuser-rol-ext-filter', { appuserRolEstado: 1 }).then(function (result) {
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
                        className: 'col-md-12',
                        key: "appuserContrasena",
                        type: "input",
                        templateOptions: {
                            label: "Contraseña temporal",
                            placeholder: "Contraseña temporal",
                            required: true
                        },
                        hideExpression: `${vm.editMode}`
                    }
                ]
            }];

        }
    }

})();