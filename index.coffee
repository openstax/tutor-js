require 'jquery'
require 'bootstrap' # Attach bootstrap to jQuery

api = require './src/api'
api.start()
Router = require './src/router'

Router.start(document.body)
