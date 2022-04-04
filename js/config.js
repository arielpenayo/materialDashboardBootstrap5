(function () {
  'use strict';
  var env = {};
  angular
    .module('app')
    .run(envConfig)
    .run(headerConfig)
    .run(formlyConfig)
    .config(function ($authProvider, config) {
      // console.log("config", config)
      // console.log("$authProvider", $authProvider);
      if (window) {
        Object.assign(env, window.__env);
      }
      console.log('env :>> ', env);
      $authProvider.baseUrl = env.serviceUrl;
      $authProvider.loginUrl = 'authentication-login';
      $authProvider.key = "Expens3T@b";
      $authProvider.storageType = 'localStorage';
    })
    .constant('config', env)
    .constant('formlyExampleApiCheck', apiCheck());
 
  function envConfig() {
    if (window) {
      Object.assign(env, window.__env);
    }
  }


  function headerConfig($http) {
    $http.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' };
  }
  function formlyConfig(formlyConfig) {
    formlyConfig.extras.removeChromeAutoComplete = true;

    // Configure custom types
    // ui-select-single
    formlyConfig.setType({
      name: 'ui-select-single',
      extends: 'select',
      templateUrl: 'ui-select-single.html'
    });

    // ui-select-single
    formlyConfig.setType({
      name: 'ui-select-single-single-async-search',
      extends: 'select',
      templateUrl: 'ui-select-single-async-search.html'
    });
    

    // currency
    formlyConfig.setType({
      name: 'currency',
      extends: 'input',
      defaultOptions: {
        ngModelAttrs: {
          ngCurrency: {
            attribute: 'ng-currency'
          },
          currencySymbol: {
            attribute: 'currency-symbol'
          },
          fraction: {
            attribute: 'fraction'
          }
        }
        ,
        templateOptions: {
          ngCurrency: '',
          currencySymbol: '',
          fraction: '2'
        },
      }
    });
    // matchfield
    formlyConfig.setType({
      name: 'matchField',
      apiCheck: function () {
        return {
          data: {
            fieldToMatch: formlyExampleApiCheck.string
          }
        }
      },
      apiCheckOptions: {
        prefix: 'matchField type'
      },
      defaultOptions: function matchFieldDefaultOptions(options) {
        return {
          extras: {
            validateOnModelChange: true
          },
          expressionProperties: {
            'templateOptions.disabled': function (viewValue, modelValue, scope) {
              var matchField = find(scope.fields, 'key', options.data.fieldToMatch);
              if (!matchField) {
                throw new Error('Could not find a field for the key ' + options.data.fieldToMatch);
              }
              var model = options.data.modelToMatch || scope.model;
              var originalValue = model[options.data.fieldToMatch];
              var invalidOriginal = matchField.formControl && matchField.formControl.$invalid;
              return !originalValue || invalidOriginal;
            }
          },
          validators: {
            fieldMatch: {
              expression: function (viewValue, modelValue, fieldScope) {
                var value = modelValue || viewValue;
                var model = options.data.modelToMatch || fieldScope.model;
                return value === model[options.data.fieldToMatch];
              },
              message: options.data.matchFieldMessage || '"Must match"'
            }
          }
        };

        function find(array, prop, value) {
          var foundItem;
          array.some(function (item) {
            if (item[prop] === value) {
              foundItem = item;
            }
            return !!foundItem;
          });
          return foundItem;
        }
      }
    });
    // typeahead
    formlyConfig.setType({
      name: 'typeahead',
      // template: '<input type="text" ng-model="model[options.key]" uib-typeahead="item for item in to.options | filter:$viewValue | limitTo:8" class="form-control">',
      template: '<input type="text" ng-model="model[options.key]" required=to.required uib-typeahead="item as item.name for item in to.options | filter:$viewValue | limitTo:8" class="form-control">',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    });

  }

}());