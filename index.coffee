$ = require 'jquery'
require 'bootstrap'

Backbone = require 'backbone'
Backbone.$ = $

Router = require './src/router'
LinkInterceptor = require './src/link-interceptor'

router = Router.start(document.body)
LinkInterceptor.start(router)
