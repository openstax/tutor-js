$ = require 'jquery'
Backbone = require 'backbone'
React = require 'react'
{Dashboard, Tasks, Invalid} = require './components'

Models = require './models'


Backbone.$ = $


start = (mountPoint) ->

  hasComponent = false
  remount = (component) ->
    React.unmountComponentAtNode(mountPoint) if hasComponent
    React.renderComponent(component, mountPoint)
    hasComponent = true

  Router = Backbone.Router.extend
    routes:
      ''          : 'dashboard'
      'dashboard' : 'dashboard'
      'tasks'     : 'tasks'
      '*invalid'  : 'invalid'

    dashboard: ->
      remount <Dashboard />
    tasks: ->
      Models.Tasks.reload()
      remount <Tasks model=Models.Tasks />
    invalid: (path) ->
      remount <Invalid path=path />

  router = new Router()
  Backbone.history.start({pushState: true})
  router


module.exports = {start}
