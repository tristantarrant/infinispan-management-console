'use strict';

angular.module('managementConsole.api')
    .factory('ServerModel', [

    function () {
            /**
             * Represents a Server
             */
            var Server = function (host, server, rootOfServer, domain) {
                this.host = host;
                this.server = server;
                this.name = (server === null) ? host : host + '/' + server;
                this.root = rootOfServer;
                this.domain = domain;
                this.lastRefresh = null;
                this.show = true;
                this.defaultStack = 'N/A';
                this.inetAddress = '';
            };

            Server.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('host', this.host, 'server', this.server);
            };

            Server.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            Server.prototype.getDefaultStack = function () {
              return this.defaultStack;
            };

            Server.prototype.getGroup = function () {
              return this.root['server-group'];
            };

            Server.prototype.getState = function () {
              return this.root['server-state'].toUpperCase();
            };

            Server.prototype.getInetAddress = function () {
              return this.inetAddress;
            };

            Server.prototype.getName = function () {
              return this.name;
            };

            Server.prototype.refresh = function () {
                this.getModelController().readAttributeAndResolveExpressions(this.getResourcePath().concat('subsystem', 'datagrid-jgroups'),
                  'default-stack', true).then(function (response) {
                  this.defaultStack = response.toUpperCase();
                }.bind(this));

                this.getModelController().readAttributeAndResolveExpressions(this.getResourcePath().concat('interface', 'public'),
                  'inet-address', true).then(function (response) {
                  this.inetAddress = response;
                }.bind(this));
            };

            Server.prototype.fetchCacheStats = function(cache) {
                return this.getModelController()
                    .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', cache.cluster.name, cache.type, cache.name),
                                  false, true).then(function (response) {
                    response['node-name'] = this.name;
                    response['cache'] = this;
                    return response;
                }.bind(this));
            };

            Server.prototype.fetchAggregateNodeStats = function (cluster) {
              return this.fetchAggregateNodeStatsByClusterName(cluster.name);
            };

            Server.prototype.fetchAggregateNodeStatsByClusterName = function (clusterName) {
              return this.getModelController()
                .readResource(this.getResourcePath().concat('subsystem', 'datagrid-infinispan', 'cache-container', clusterName),
                false, true).then(function (response) {
                  return response;
                }.bind(this));
            };

            Server.prototype.isRunning = function() {
              var state = this.getState();
              return state === 'RUNNING' || state === 'RELOAD_REQUIRED' || state === 'RESTART_REQUIRED';
            };

            return Server;
    }
  ]);
