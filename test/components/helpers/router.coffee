React = require 'react/addons'
Router = require 'react-router'
{routes} = require '../../../src/router'
{Promise} = require 'es6-promise'
_ = require 'underscore'


routerStub =
  container: document.createElement('div')

  _goTo: (div, route, result) ->

    result ?= {}

    history = new Router.TestLocation([route])
    promise = new Promise (resolve, reject) ->
      Router.run routes, history, (Handler, state)->
        router = @
        try
          React.render(<Handler/>, div, ->
            component = @
            result = _.defaults({div, component, state, router, history}, result)
            resolve(result)
          )
        catch error
          reject(error)

    promise

  goTo: (route, result) ->
    @_goTo(@container, route, result)

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  forceUpdate: (component, args...) ->
    promise = new Promise (resolve, reject) ->
      try
        component.forceUpdate( ->
          resolve(args...)
        )
      catch error
        reject(error)

    promise


module.exports = routerStub