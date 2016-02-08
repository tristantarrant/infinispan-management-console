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
          address: [{deployment: "custom-store.jar"}],
          operation: "add",
          enabled: "true"
        };
        modelController.uploadFile(op, $scope.fileToUpload, function(){});
      };

    }]);
