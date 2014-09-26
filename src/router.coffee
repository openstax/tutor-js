Backbone = require 'backbone'
React = require 'react'
{Dashboard, Tasks, Invalid} = require './components'

start = (mountPoint) ->

  Router = Backbone.Router.extend
    routes:
      ''        : 'root'
      'tasks'   : 'tasks'
      '*invalid': 'invalid'

    root: ->
      React.renderComponent(<Dashboard/>, mountPoint)
    tasks: ->
      React.renderComponent(<Tasks/>, mountPoint)
    invalid: (path) ->
      React.renderComponent(<Invalid path=path />, mountPoint)

  router = new Router()
  Backbone.history.start({pushState: true})
  router


module.exports = {start}
