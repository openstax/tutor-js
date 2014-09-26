Backbone = require 'backbone'
React = require 'react'
{Dashboard, AboutUs} = require './components'

start = (mountPoint) ->

  Router = Backbone.Router.extend
    routes:
      '': 'root'
      'about': 'about'

    root: ->
      React.renderComponent(<Dashboard/>, mountPoint)
    about: ->
      React.renderComponent(<AboutUs/>, mountPoint)

  router = new Router()
  Backbone.history.start({pushState: true})
  router


module.exports = {start}
