Backbone = require 'backbone'
React = require 'react'
{Dashboard, Tasks, Invalid} = require './components'

Models = require './models'

start = (mountPoint) ->

  Router = Backbone.Router.extend
    routes:
      ''        : 'root'
      'tasks'   : 'tasks'
      '*invalid': 'invalid'

    root: ->
      React.renderComponent(<Dashboard />, mountPoint)
    tasks: ->
      Models.Tasks.reload()
      React.renderComponent(<Tasks model=Models.Tasks />, mountPoint)
    invalid: (path) ->
      React.renderComponent(<Invalid path=path />, mountPoint)

  router = new Router()
  Backbone.history.start({pushState: true})
  router


module.exports = {start}
