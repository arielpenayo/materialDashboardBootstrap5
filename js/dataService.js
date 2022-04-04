(function () {
    'use strict';

    angular
        .module('app')
        .service('dataService', dataService)

    dataService.$inject = ['$http', 'config','md5'];

    function dataService($http, config,md5) {

        var headers = {headers: {
            'Content-Type': 'application/json',
            'ApiToken':(moment().format('DD-MM-YYYY HH')).toString(),
            'ApiHash': md5.createHash((moment().format('DD-MM-YYYY HH')).toString()+ config.key)
        }};


        return {
            findAll: findAll,
            findByPk: findByPk,
            findAllByFilter: findAllByFilter,
            create: create,
            update: update,
            delete: deleteObject
        };
        function findAll(resource) {
            return $http.get(config.serviceUrl + resource,headers)
                .then(dataServiceComplete)
                .catch(dataServiceFailed);
        }

        function findByPk(resource, id) {
            return $http.get(config.serviceUrl + resource + '/' + id,headers)
                .then(dataServiceComplete)
                .catch(dataServiceFailed);
        }

        function findAllByFilter(resource, data) {
            var dataString = JSON.stringify(data);
            return $http.post(config.serviceUrl + resource, dataString, headers)
                .then(dataServiceComplete)
                .catch(dataServiceFailed);
        }

        function create(resource, data) {
            var dataString = JSON.stringify(data);
            return $http.post(config.serviceUrl + resource, dataString, headers)
                .then(dataServiceComplete)
                .catch(dataServiceFailed);
        }

        function update(resource, id, data) {  
            var dataString = JSON.stringify(data);
            return $http.put(config.serviceUrl + resource + '/' + id, dataString, headers)
                .then(dataServiceComplete)
                .catch(dataServiceFailed);
        }

        function deleteObject(resource, id) {
            return $http.delete(config.serviceUrl + resource + '/' + id, headers)
                .then(dataServiceComplete)
                .catch(dataServiceFailed);
        }

        function dataServiceComplete(response) {
            if (!response.data) {
                response.data = [];
            }
            return { success: true, data: response.data };
        }

        function dataServiceFailed(error) {
            if (error.status == -1) {
                return { success: false, message: 'Error de comunicación' };
            } else {
                if (error.status == 404) {
                    return { success: false, message: 'Recurso no encontrado' };
                } if (error.status == 500) {
                    if (error.data.parent) {
                        return { success: false, message: 'Error en base de datos ' + error.data.parent.sqlMessage };
                    } else {
                        return { success: false, message: 'Error en base de datos ' + error.data.errors[0].message };
                    }
                } else {
                    return { success: false, message: 'Error desconocido' };
                }
            }
        }
    }
})();