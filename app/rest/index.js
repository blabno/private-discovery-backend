'use strict';

const Boom = require('boom');
const hapi = require('hapi');
const hapiSwagger = require('hapi-swagger');
const good = require('good');
const blipp = require('blipp');
const inert = require('inert');
const vision = require('vision');

const config = require('../config');
const feedEndpoint = require('./feed.endpoint');
const packageJson = require('../../package.json');
const postEndpoint = require('./post.endpoint');
const subscriptionEndpoint = require('./subscription.endpoint');
const wallEndpoint = require('./wall.endpoint');

function registerRoutes(server) {
  feedEndpoint.register(server);
  postEndpoint.register(server);
  subscriptionEndpoint.register(server);
  wallEndpoint.register(server);
}

function tags() {
  return [
    feedEndpoint.tag,
    postEndpoint.tag,
    subscriptionEndpoint.tag,
    wallEndpoint.tag
  ];
}

const hapiSwaggerPlugin = {
  plugin: hapiSwagger,
  options: {
    host: config.swagger.host,
    basePath: '/',
    pathPrefixSize: 1,
    expanded: 'none',
    info: {
      title: packageJson.description,
      version: packageJson.version
    },
    tags: tags()
  }
};

const goodPlugin = {
  plugin: good,
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      console: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [
            {
              log: '*',
              request: '*',
              response: '*'
            }
          ]
        }, {
          module: 'good-console'
        }, 'stdout'
      ]
    }
  }
};

const blippPlugin = {
  plugin: blipp,
  options: {
    showAuth: true
  }
};

async function createServer() {
  const server = await new hapi.Server({
    port: config.port,
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          if (err && err.isJoi) {
            throw err;
          } else {
            throw Boom.badRequest('Invalid request payload input');
          }
        }
      }
    }
  });

  await server.register([
    blippPlugin,
    inert,
    vision,
    goodPlugin,
    hapiSwaggerPlugin
  ]);

  registerRoutes(server);

  return server;
}

module.exports = createServer;
