(function(){
    'use strict';

    angular
        .module('app')
        .controller('estadoCuentaCtrl', estadoCuentaCtrl)

    estadoCuentaCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$location','$state','$stateParams'];

    function estadoCuentaCtrl(dataService,toastr,$scope,$uibModal,$location,$state,$stateParams) {
        /* jshint validthis:true */
        var vm = this;
        var dialog;
        vm.saldoActual = 0;
        vm.movimientoTotal = 0;
        vm.impArray = []
        vm.estadoCuenta = []
        vm.cantidadTerrenos = 0;
        vm.cantidadMetrosCuadrados=0;
        vm.saldoInicioMes = 0
        vm.form = {};
        vm.cliente = [];
        vm.filtro = {}
        let filtroCopia = {}


        vm.generarExpensaMensual = function() {
            // vm.dataLoading = true;
           
            dialog = $uibModal.open({
                templateUrl: '../../views/common/modal.html',
                controller: ['entidad', activateModalCtrl],
                controllerAs: 'vm',
                resolve: { entidad: function() { return true; } }
            });

        }

        function activateModalCtrl() {
            var vm2 = this;
            vm2.confirmar = confirmar;
            var actualizacion;
            var mensaje = "Expensa mensual generada con éxito!" ;
            vm2.titulo = 'Pedido de confirmación';

                vm2.mensaje = `Deseas generar la expensa mensual ? \n OBS: Genera para todos los clientes`;


            function confirmar() {
                vm.dataLoading = true;
                dialog.close();

                dataService.findAllByFilter('terreno-filter',{terrenoEstado:3})
                .then((result) => {
                    if (result.success) {
                        moment.locale('es');
                        let mesAnterior = moment().subtract(1,'months').format('MMMM');
                        let datosAEnviar = [];
                        result.data.map(element => {
                            let terrenoSuperficieCosto = element.terrenoSuperficie * 200;

                            datosAEnviar.push({
                                movimientoFecha:moment(),
                                movimientoTipoId:1,
                                movimientoMonto:terrenoSuperficieCosto,
                                terrenoId:element.terrenoId,
                                clienteId:element.clienteId,
                                movimientoObservacion: `Por el mes de ${mesAnterior}`
                            })
                        });

                        dataService.create('movimiento-bulk', datosAEnviar)  
                        .then(function(result) {
                            if (result.success) {
                                toastr.success('Expensa mensual generada con éxito', 'Aviso');
                            } else {
                                toastr.error(result.message, 'Aviso');
                            }
                        })
                        .finally(function() {
                            vm.dataSaving = false;
                            vm.dataLoading = false;
                        });

                    }
                }).catch((err) => {
                    console.log('err :>> ', err);
                    vm.dataLoading = false
                });
                
            }
        }

        vm.impresion = function(listado,filtro){
            
            vm.saldoInicioMes = 0
            vm.saldoFinalMes = 0
            let copiaMovimientoListado = angular.copy(listado)
            
            // let firstDay = new Date(filtro.anho, filtro.fecha - 1, 1);
            let firstDay = moment(filtro.fechaDesde).format("YYYY-MM-DD")

            createPrintObj(copiaMovimientoListado,vm.saldoInicial,vm.saldoActual,firstDay);
            
                
        }
        function createPrintObj(listado,saldoInicio,saldoFinal,inicioMesFecha){

            vm.impArray = []
            listado.forEach(element => {
        
                let record = []
                // Encabezado
                record =  [
                    {
                        margin: [0,-2,0,0],
                        text:moment(element.movimientoFecha).format('DD/MM/YYYY'),
                        bold:true,
                        border:[false,false,false,false]
                        
                    },
                   
                    {
                        margin: [0,-2,0,0],
                        text: element.tipoMovimiento,
                        fontSize:7,
                        border:[false,false,false,false]
                    },
                    {
                        margin: [0,-2,0,0],
                        text: element.terrenoId,
                        border:[false,false,false,false]
                    },
                    {
                        margin: [0,-2,0,0],
                        text: element.movimientoObservacion,
                        fontSize:7,
                        border:[false,false,false,false]
                    },
                    {
                        margin: [0,-2,0,0],
                        text:formatNumber(Math.round(element.movimientoMonto)),
                        alignment: 'right',
                        border:[false,false,false,false]
                    },
                     {
                        margin: [0,-2,0,0],
                        text:formatNumber(Math.round(element.movimiento)),
                       //  fontSize:6,
                        alignment: 'right',
                        border:[false,false,false,false]
                        
                    }       
                   
                ]
                vm.impArray.push(record)
            })
           
           var printObj = {
                // pageOrientation: 'landscape',
                pageSize:'A4',
                pageMargins:[20,15,25,5],
                content : { 

                    table : { 
                   //   headerRows: 3, 
                
                     body: [ 
                         [  {
                            // Estilos generales
    
                            margin: [-15, -30, 0, 10],
                            fontSize: 10,
                            widths: [60],
                            // tabla para recuadro de la pagina
    
                            // pageBreak:'after',
                            table: {
    
                                widths: [230, 115, 80, 118, 75],
                                body: [
                                    // ROW 1
                                    [
                                        {
                                            // margin: [2, 2, 2, 2],
                                            border: [false, false, false, false],
                                            table: {
    
                                                body: [
    
                                                    [
                                                        {
                                                            border: [false, false, false, false],
                                                            stack: [
                                                                {
                                                                margin: [-20, 15, 0, 0],
                                                                image:'data:image/png;base64,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',
                                                                width: 200,
                                                                border: [false, false, false, false]
                                                            } ]
                                                        }
                                                    ]
                                                ]
    
                                            }
                                        },
                                        // DCHA
                                        {
                                            margin: [10, 0, 10, 30],
                                            colSpan: 4,
                                            border: [false, false, false, false],
                                            stack: [
                                                { text: 'Fecha de impresión: '+moment().format('DD/MM/YYYY') ,bold: true,fontSize: 5,  margin: [220, 20, 0, 0] },
                                                { text: 'Hora de impresión: '+ moment().format('HH:mm:ss'),bold: true,fontSize: 5,   margin: [220, 0, 0, 0] },
                                                { text: 'EXTRACTO ', fontSize: 14, bold: true, alignment: 'center', margin: [-90, 0, 0, 0] },
                                                { text: listado[0].clienteRazonSocial, fontSize: 13, bold: true, alignment: 'center', margin: [-90, 0, 0, 0] },
                                                { text: '', margin: [-80, 0, 0, 0], fontSize: 12, alignment: 'center' }
                                            ]
                                        }
                                    ],
                                    // ROW 2
    
                                ],
    
                            },
                        },
    ],
                   
        
                       [ 
                      { 
                      columns: [ 
                                   {
                                       table: {
                                           widths:[400],
                                           // margin:[0,0,0,0],
                                           body: [
                                               [
                                               {text:`Saldo de apertura a partir de ${moment(inicioMesFecha).format('DD/MM/YYYY')}: \t ${formatNumber(saldoInicio)}`,margin:[0,0,0,0],fontSize: 13,border:[false,false,false,false]},
                                              
                                               ]
                                           ]
                                       }
                                   }
                      ] 
                      } 
                     ], 
                       [ 
                      { 
                      columns: [ 
                                   {
                                       table: {
                                           widths:[40,90,30,150,50,50],
                                           // margin:[0,0,0,0],
                                           body: [
                                               [
                                               {text:'Fecha',margin:[0,0,0,0],fontSize: 8,border:[false,false,false,true]},
                                               {text:'Movimiento',margin:[30,0,0,0],fontSize: 8,border:[false,false,false,true]},
                                               {text:'Terreno',margin:[0,0,0,0],fontSize: 8,border:[false,false,false,true]},
                                               {text:'Observación',alignment:'center',margin:[0,0,0,0],fontSize: 8,border:[false,false,false,true]},
                                               {text:'Monto',alignment: 'right',margin:[0,0,0,0],fontSize: 8,border:[false,false,false,true]},
                                            {text:'Saldo ',alignment: 'right',margin:[0,0,0,0],fontSize: 8,border:[false,false,false,true]},
                                              
                                               ]
                                           ]
                                       }
                                   }
                      ] 
                      } 
                     ], 
                   [ 
                     { 
                     columns: [ 
                           {
                               alignment: 'justify',
                               fontSize: 8,
                               widths: [60],
                               table: {
                                   widths:[45,90,28,150,50,50],
                                   body: vm.impArray
                               },
                           }
                     ] 
                     } 
                   ], 
                   [ 
                    { 
                    columns: [ 
                                 {
                                     table: {
                                         widths:[90,50,30,150,50,50],
                                         // margin:[0,0,0,0],
                                         body: [
                                             [
                                             {text:'Saldo Final:',margin:[0,0,0,0],fontSize: 9,border:[false,true,false,false]},
                                             {text:'',margin:[30,0,0,0],fontSize: 8,border:[false,true,false,false]},
                                             {text:'',margin:[0,0,0,0],fontSize: 8,border:[false,true,false,false]},
                                             {text:'',alignment:'center',margin:[0,0,0,0],fontSize: 8,border:[false,true,false,false]},
                                             {text:'',alignment:'center',margin:[0,0,0,0],fontSize: 8,border:[false,true,false,false]},
                                            //  {text:formatNumber(Math.round(vm.movimientoTotal - vm.saldoInicial)),alignment: 'right',margin:[0,0,0,0],fontSize: 9,border:[false,true,false,false]},
                                             {text:formatNumber(Math.round(saldoFinal)),alignment: 'right',margin:[0,0,0,0],fontSize: 9,border:[false,true,false,false]},
                                            
                                             ]
                                         ]
                                     }
                                 }
                    ] 
                    } 
                   ], 
               
                
                
                     ] 
                    }, 
                
                
                    // Table Styles 
                
                    layout: { 
                     hLineWidth: function(i, node) { return (i === 1 || i === 2) ? 0 : 0; }, 
                     vLineWidth: function(i, node) { return 0; }, 
                     hLineColor: function(i, node) { return (i === 1 || i === 2) ? '' : ''; }, 
                     vLineColor: function(i, node) { return '' }, 
                     paddingBottom: function(i, node) { 
                     switch (i) { 
                      case 0: 
                      return 5; 
                      case 1: 
                      return 2; 
                      default: 
                      return 0; 
                     } 
                     }, 
                     paddingTop: function(i, node) { 
                     switch (i) { 
                      case 0: 
                      return 0; 
                      case 1: 
                      return 2; 
                      default: 
                      return 10; 
                     } 
                     } 
                    } 
                    }, 
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15],
                        
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                // defaultStyle: {
                //     font: 'arial'
                // }
            }
        
            // pdfMake.fonts = {
            //     arial: {
            //         normal: 'arial.ttf',
            //         bold: 'arialbd.ttf',
            //         italics: 'ariali.ttf',
            //         bolditalics: 'arialbi.ttf'
            //     },
            // }
        
            pdfMake.createPdf(printObj).download(`${vm.cliente.clienteRazonSocial}-EXTRACTO-${moment().format('DD/MM/YYYY')}.pdf`);
            // pdfMake.createPdf(printObj).open();
        }
        vm.formFields = [{
            className: 'row',
            fieldGroup: [
                {
                    key: 'fechaDesde',
                    className: 'col-md-6',
                    type: 'input',
                    templateOptions: {
                        label: 'Desde',
                        placeholder: 'Desde',
                        type: 'date',
                        notNull: true,
                        required:true,
                        
                        
                    },

                },
                {
                    key: 'fechaHasta',
                    className: 'col-md-6',
                    type: 'input',
                    templateOptions: {
                        label: 'Hasta',
                        placeholder: 'Hasta',
                        type: 'date',
                        notNull: true,
                        required:true,
                        


                    },

                },
              
                // {
                //     className: 'col-md-3',
                //     key: 'fecha',
                //     type: "select",
                //     defaultValue:moment().month() + 1,
                //     templateOptions: {
                //         label: 'Mes',
                //         placeholder: 'Mes',
                //         notNull: true,
                //         required:true,
                //         options: [
                //             {name: 'ENERO', value: 1},
                //             {name: 'FEBRERO', value: 2},
                //             {name: 'MARZO', value: 3},
                //             {name: 'ABRIL', value: 4},
                //             {name: 'MAYO', value: 5},
                //             {name: 'JUNIO', value: 6},
                //             {name: 'JULIO', value: 7},
                //             {name: 'AGOSTO', value: 8},
                //             {name: 'SEPTIEMBRE', value: 9},
                //             {name: 'OCTUBRE', value: 10},
                //             {name: 'NOVIEMBRE', value: 11},
                //             {name: 'DICIEMBRE', value: 12},
                //         ]
                //     },
                // },
                // {
                //     className: 'col-md-3',
                //     key: 'anho',
                //     type: "select",
                //     defaultValue:moment().year(),
                //     templateOptions: {
                //         label: 'Año',
                //         placeholder: 'Año',
                //         notNull: true,
                //         required:true,
                //         options: [
                //             {name: '2021', value: 2021},
                //             {name: '2022', value: 2022},
                //             {name: '2023', value: 2023},
                //             {name: '2024', value: 2024},
                //             {name: '2025', value: 2025}
                //         ]
                //     },
                // }

            ]
        }
            	
        ];
        vm.filtrar = function (filtro) {
            filtrar(filtro);
            
        }

        function isEmpty(obj) {
            return Object.values(obj).every(el => el === undefined)
        }

        function filtrar(filtro) {
            vm.dataSaving = true;
            vm.estadoCuenta = [];
            vm.saldoActual = 0;
            vm.saldoInicial = 0
            vm.movimientoTotal = 0
          
            if (isEmpty(filtro)) {
               
                let filtroAEnviar = {
                    clienteId:$stateParams.id,
                    movimientoEstado:1
                }
               
            
    
                dataService.findAllByFilter('movimientoext-filter', filtroAEnviar) 
                .then(function(resultado) {
                    if (resultado.success) {
                        let anterior = 0;
                        if (resultado.data.length) {
                           
                            resultado.data.map((element,index) => {
                                element.movimientoMonto = parseFloat(element.movimientoMonto);
                                if(index == 0){
                                    anterior = 0;
                                  
                                    element.saldo =  element.movimientoMonto;
                                    anterior = element.saldo;
                                    vm.movimientoTotal =  element.movimientoMonto
                                   
                                }else{
                                    if(element.movimientoTipoId == 2 || element.movimientoTipoId == 9){
                                        element.saldo = anterior -  element.movimientoMonto;
                                        anterior = element.saldo ;
                                        vm.movimientoTotal = vm.movimientoTotal -  element.movimientoMonto;
                                    }else{
                                        element.saldo = anterior + element.movimientoMonto;
                                        anterior = element.saldo;
                                        vm.movimientoTotal = vm.movimientoTotal + element.movimientoMonto
                                    }
                                   
                                }
                            });
                            vm.saldoActual = vm.movimientoTotal
                            // result.data.reverse();
                            vm.estadoCuenta = resultado.data
                        }
    
    
                    } else {
                        toastr.error(resultado.message, 'Aviso');
                    }
                })
                .catch((err) => {
                    console.log(`err`, err)    
                })
                .finally(function() {
                    vm.dataSaving = false;
                });
                   
                 
                 
                   
            }else{
                let filtroAEnviar = {
                    clienteId:$stateParams.id,
                    movimientoEstado:1,
                    movimientoFecha:
                    {
                        $between: [moment(filtro.fechaDesde).format("YYYY-MM-DD"),
                        moment(filtro.fechaHasta).format("YYYY-MM-DD")]
                    }
                }
               
                vm.dataSaving = true;
              


                let firstDay = moment(filtro.fechaDesde).format("YYYY-MM-DD")
                
                dataService.findAllByFilter('movimientoext-filter', {
                    clienteId:$stateParams.id,
                    movimientoEstado:1,
                    movimientoFecha: {$lt:firstDay}
                }) 
                .then(function(resultado) {
                    if (resultado.success) {
                        let anterior = 0;
                        if (resultado.data.length) {
                            
                            resultado.data.map((element,index) => {
                                element.movimientoMonto = parseFloat(element.movimientoMonto);
                                if(index == 0){
                                  anterior = 0;
                                  if (element.movimientoTipoId == 2 || element.movimientoTipoId == 9) {
                                      
                                      element.saldo = -1* element.movimientoMonto;
                                      anterior = element.saldo;
                                      vm.saldoInicial = -1* element.movimientoMonto
                                  }else{

                                      element.saldo =  element.movimientoMonto;
                                      anterior = element.saldo;
                                      vm.saldoInicial =  element.movimientoMonto
                                  }
    
                                }else{
                                    if(element.movimientoTipoId == 2 || element.movimientoTipoId == 9){
                                        element.saldo = anterior -  element.movimientoMonto;
                                        anterior = element.saldo ;
                                        vm.saldoInicial = vm.saldoInicial -  element.movimientoMonto;
                                    }else{
                                    
                                        element.saldo = anterior + element.movimientoMonto;
                                        anterior = element.saldo;
                                        vm.saldoInicial = vm.saldoInicial + element.movimientoMonto
                                    }
                                   
                                }
                            });
                        }
    
    
                    } else {
                        toastr.error(resultado.message, 'Aviso');
                    }
                })
                .catch((err) => {
                    console.log(`err`, err)    
                })
                dataService.findAllByFilter('movimientoext-filter', filtroAEnviar)  
                .then(function(result) {
                    if (result.success) {
                        let anteriorMovimiento = 0;
                        if (result.data.length) {
                            
                            result.data.map((element,index) => {
                                element.movimientoMonto = parseFloat(element.movimientoMonto);
                                
                                if(index == 0){
                                    
                                    anteriorMovimiento = 0;
                                
                                    if(element.movimientoTipoId == 2 || element.movimientoTipoId == 9){
                                         //MOVIMIENTO
                                        element.movimiento =  -element.movimientoMonto + vm.saldoInicial;
                                        anteriorMovimiento = element.movimiento;
                                        vm.movimientoTotal =  -element.movimientoMonto + vm.saldoInicial;
                                    }else{
                                        //MOVIMIENTO
                                        element.movimiento =  element.movimientoMonto + vm.saldoInicial;
                                        anteriorMovimiento = element.movimiento;
                                        vm.movimientoTotal =  element.movimientoMonto + vm.saldoInicial;
                                        
                                    }
                                  
                                    
                                }else{
                                    if(element.movimientoTipoId == 2 || element.movimientoTipoId == 9){
                                        //MOVIMIENTO
                                        element.movimiento = anteriorMovimiento -  element.movimientoMonto;
                                        anteriorMovimiento = element.movimiento ;
                                        vm.movimientoTotal = vm.movimientoTotal -  element.movimientoMonto;
                                     
                                    }else{
                                        //MOVIMIENTO
                                        element.movimiento = anteriorMovimiento +  element.movimientoMonto;
                                        anteriorMovimiento = element.movimiento ;
                                        vm.movimientoTotal = vm.movimientoTotal +  element.movimientoMonto;
                                       
                                    }
                                    
                                }
                            });
                          
                            vm.saldoActual = vm.movimientoTotal 
                            vm.estadoCuenta = result.data

                        }

                    } else {
                        toastr.error(result.message, 'Aviso');
                    }
                })
                .catch((err) => {
                    console.log(`err`, err)    
                })
                .finally(function() {
                    vm.dataSaving = false;
                });
                   
           
                   
                 
              
            }    
            
                
           
        }

        activate();

        
        function formatNumber(num, fixed) {
            var decimalPart;

            var array = Math.floor(num).toString().split('');
            var index = -3;
            while (array.length + index > 0) {
                array.splice(index, 0, '.');
                index -= 4;
            }

            if (fixed > 0) {
                decimalPart = num.toFixed(fixed).split(".")[1];
                return array.join('') + "," + decimalPart;
            }
            return array.join('');
        };
        function findTerrenosCantidadById(clienteId) {
            return dataService.findAllByFilter("terreno-filter",{clienteId:clienteId})
            .then(function(result) { 

                if (result.success) {
                     if (result.data.length) {
                         result.data.map(element => {
                             if (element.terrenoSuperficie) {
                                 vm.cantidadMetrosCuadrados = vm.cantidadMetrosCuadrados + parseFloat(element.terrenoSuperficie)
                             }
                         });
                         vm.cantidadTerrenos = result.data.length;
                         return true
                     }else{
                        return true
                     }
                }
            })
            .catch((err) => {
                console.log('err :>> ', err);    
                return false
            });
        }
        function findClienteById(id) {
            return dataService.findByPk("cliente",id)
            .then(function(result) { 
                if (result.success) {
                    return result;     
                }
            })
            .catch((err) => {
                console.log('err :>> ', err);    
                return false
            });
        }

      
        vm.eliminar = function(movimientoId,) {
			var datos = {
				movimientoId: movimientoId
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
			var mensaje = 'Movimiento eliminado con éxito!';
			vm.titulo = 'Pedido de confirmación';

            vm.mensaje = 'Deseas eliminar el Movimiento?';
			
			
			function confirmar() {
                vm.dataSaving = true;
                
				return dataService
					.delete('movimiento', datos.movimientoId)
					.then(function(result) {
						if (result.success) { 

                            toastr.success(mensaje, 'Aviso');
							dialog.close();
                            vm.dataSaving = false;
                            activate()
                    
                            
						} else {
                            toastr.error(result.message, 'Aviso');
							dialog.close();
						}
					})
                    .finally(function() {
                        // location.reload(); 
                    });
			}
		}
        function activate() {
            findClienteById($stateParams.id)
            .then((result) => {
                
                vm.cliente = result.data
                
            }).catch((err) => {
              console.log(`err`, err)  
            })
            findTerrenosCantidadById($stateParams.id)

            filtrar({})
          
        }
    }
})();