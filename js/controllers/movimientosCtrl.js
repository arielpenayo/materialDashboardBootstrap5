
(function(){
    'use strict';

    angular
        .module('app')
        .controller('movimientosCtrl', movimientosCtrl)

    movimientosCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$location','$state'];

    function movimientosCtrl(dataService,toastr,$scope,$uibModal,$location,$state) {
        /* jshint validthis:true */
        var vm = this;
        var dialog;
        vm.movimientos = []
        vm.form = {};
        vm.mes = '';
        vm.movimiento = '';
        vm.sumarTotal = function () {
            let {saldoClientesTotal} = $scope.movimientosFiltrados.reduce((acc,item)=> {
        
               
                    acc.saldoClientesTotal += + (item.movimientoMonto ? parseFloat(item.movimientoMonto) : 0)
        
                return acc
            },{saldoClientesTotal:0})
            return {saldoClientesTotal}
        }
        vm.anho = new Date().getFullYear();
        vm.formFields = [{
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-md-3',
                    key: 'movimientoTipoId',
                    type: "select",
                    templateOptions: {
                        label: 'Movimiento',
                        placeholder: 'Movimiento',
                        notNull: true,
                        required: true,
                        options: [
                            {name: 'EXPENSAS', value: 1},
                            {name: 'PAGO', value: 2},
                            {name: 'CORTE DE PASTO', value: 3},
                            {name: 'ELECTRICIDAD', value: 4},
                            {name: 'AGUA', value: 5},
                            {name: 'INTERES POR MORA', value: 6},
                            {name: 'EMPEDRADO', value: 7},
                            // {name: 'SALDO ANTERIOR', value: 8},
                        ]
                    },
                },
                {
                    className: 'col-md-3',
                    key: 'fecha',
                    type: "select",
                    templateOptions: {
                        label: 'Mes',
                        placeholder: 'Mes',
                        notNull: true,
                        required:true,
                        options: [
                            {name: 'ENERO', value: 1},
                            {name: 'FEBRERO', value: 2},
                            {name: 'MARZO', value: 3},
                            {name: 'ABRIL', value: 4},
                            {name: 'MAYO', value: 5},
                            {name: 'JUNIO', value: 6},
                            {name: 'JULIO', value: 7},
                            {name: 'AGOSTO', value: 8},
                            {name: 'SEPTIEMBRE', value: 9},
                            {name: 'OCTUBRE', value: 10},
                            {name: 'NOVIEMBRE', value: 11},
                            {name: 'DICIEMBRE', value: 12},
                        ]
                    },
                },
                {
                    className: 'col-md-3',
                    key: 'anho',
                    type: "select",
                    templateOptions: {
                        label: 'Año',
                        placeholder: 'Año',
                        notNull: true,
                        required:true,
                        options: [
                            {name: '2021', value: 2021},
                            {name: '2022', value: 2022},
                            {name: '2023', value: 2023},
                            {name: '2024', value: 2024},
                            {name: '2025', value: 2025}
                        ]
                    },
                }
            ]
        }
            	
        ];

        alasql.fn.enteroDecimal= function(val,lugares) {
            return Number(val).toFixed(lugares);
        };
        vm.exportData = function(filtro) {
            switch (filtro.movimientoTipoId) {
                case 1:
                    vm.movimiento = 'EXPENSAS'
                    break;
                case 2:
                    vm.movimiento = 'PAGO'
                    break;
                case 3:
                    vm.movimiento = 'CORTE DE PASTO'
                    break;
                case 4:
                    vm.movimiento = 'ELECTRICIDAD'
                    break;
                case 5:
                    vm.movimiento = 'AGUA'
                    break;
                case 6:
                    vm.movimiento = 'INTERES POR MORA'
                    break;
                case 7:
                    vm.movimiento = 'EMPEDRADO'
                    break;
            
            }
            switch (filtro.fecha) {
                case 1:
                    vm.mes = 'ENERO'
                    break;
                case 2:
                    vm.mes = 'FEBRERO'
                    break;
                case 3:
                    vm.mes = 'MARZO'
                    break;
                case 4:
                    vm.mes = 'ABRIL'
                    break;
                case 5:
                    vm.mes = 'MAYO'
                    break;
                case 6:
                    vm.mes = 'JUNIO'
                    break;
                case 7:
                    vm.mes = 'JULIO'
                    break;
                case 8:
                    vm.mes = 'AGOSTO'
                    break;
                case 9:
                    vm.mes = 'SEPTIEMBRE'
                    break;
                case 10:
                    vm.mes = 'OCTUBRE'
                    break;
                case 11:
                    vm.mes = 'NOVIEMBRE'
                    break;
                case 12:
                    vm.mes = 'DICIEMBRE'
                    break;
            
            }

            // let nombreArchivo = `xlsx`
            alasql(`SELECT  
                    movimientoFecha as [Fecha],
                    clienteRazonSocial as [Cliente],
                    IFNULL(movimientoObservacion,'') as [Observacion],
                    IFNULL(terrenoId,'') as [Terreno],
                    enteroDecimal(movimientoMonto) as [Monto]
                    INTO XLSX("${vm.movimiento}-${vm.mes}-${vm.anho}.xlsx",{headers:true}) FROM ?`, [$scope.movimientosFiltrados]);
        };

        vm.filtrar = function (filtro) {
            filtrar(filtro);
            
        }

        function filtrar(filtro) {
          
            
            
                
            let filtroAEnviar = {
                movimientoTipoId:filtro.movimientoTipoId,
                movimientoFechaMes:filtro.fecha,
                movimientoEstado:1,
                movimientoFechaAnho:filtro.anho
            }
           
            vm.dataSaving = true;
          
            vm.movimientos = [];
            vm.montoTotal = 0;

            return dataService.findAllByFilter('movimientoext-filter', filtroAEnviar)  
                .then(function(result) {
                    if (result.success) {

                        if (result.data.length) {
                        
                            vm.movimientos = result.data
                            
                        }


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