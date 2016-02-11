'use strict';

angular.module('managementConsole')
  .controller('editContainerDeployCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'utils',
    'modelController',
    function ($scope, $state, $stateParams, utils, modelController) {
      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);
      $scope.fileToUpload = null;
      $scope.uploadDMR = function (){
        var op = {
          operation: "add",
          address: [{deployment: "custom-store.jar"}],
          'runtime-name':'custom-store.jar',
          enabled: "false",
          content: [{'input-stream-index':0}]
        };
        modelController.uploadFile(op, $scope.fileToUpload, function(){});
      };

    }]);
