(function () {
    'use strict';

    angular
        .module('app')
        .controller('mainCtrl', mainCtrl)

    mainCtrl.$inject = ['$location', '$scope', '$timeout', 'dataService', 'toastr', '$uibModal','$auth'];

    function mainCtrl($location, $scope, $timeout, dataService, toastr, $uibModal,$auth) {
        var vm = this;
        var dialog;
        $scope.events = []
      vm.transaccionValores = []
      vm.transaccionLabels = []
 
    function getTransacciones() {
      vm.dataLoading = true;
      return dataService.findAllByFilter("transaccion-ext-gpby-categoria-filter",{usuarioId:vm.usuario.usuarioId,transaccionFechaMes:moment().month() + 1,categoriaEstado:{$in:[1,2]}})
          .then(function(result) { 

              
              if (result.success) {
                  vm.transacciones = result.data;    
                  vm.transaccionValores = result.data.map(function (obj) { return obj.transaccionMonto; });
                  vm.transaccionLabels =  result.data.map(function (obj) { return obj.categoriaDenominacion; });
                  console.log('vm.transaccionValores', vm.transaccionValores)
                  console.log('vm.transaccionLabels', vm.transaccionLabels)
              } else {
                  toastr.error(result.message,'Error');
              }
          })
          .finally(function() {
              vm.dataLoading = false;
              var data = {
                datasets: [{
                    data: vm.transaccionValores,
                    backgroundColor: [
                        'rgb(255, 99, 132,0.5)',
                        'rgb(75, 192, 192,0.5)',
                        'rgb(255, 205, 86,0.5)',
                        'rgb(201, 203, 207,0.5)',
                        'rgb(54, 162, 235,0.5)'
                      ],
                      borderColor: "rgba(0, 0, 0, 0.5)",
                    label: 'My dataset'
                }],
                labels: vm.transaccionLabels
            };
            var ctx = $("#myChart");
            new Chart(ctx, {
                data: data,
                type: 'polarArea',
                options: {
                    responsive: true,
                 
                  layout: {
                    padding: 10,
                  },    
                  scale: {
                    display: true,
                  },
                  legend: {
                    labels: {
                        usePointStyle: true
                     },
                     
                    display: true,
                    position:'bottom',
                    align:'center'
                  },
                  
                  
                }
            });
          });
  }

    
        activate()
        async function activate() {

            vm.dataLoading = false
            vm.esAdmin = true 
            vm.usuario = $auth.getPayload()
            // getTransacciones()
      

        }
    }
})();