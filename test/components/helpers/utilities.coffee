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
      Router.run routes, history, (Handler, state) ->
        router = @
        try
          React.render(<Handler/>, div, ->
            component = @
            # merge in custom results with the default kitchen sink of results
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

componentStub =
  container: document.createElement('div')
  _render: (div, component, result) ->
    result ?= {}

    promise = new Promise (resolve, reject) ->
      try
        React.render(component, div, ->
          component = @
          # merge in custom results with the default kitchen sink of results
          result = _.defaults({div, component}, result)
          resolve(result)
        )
      catch error
        reject(error)

    promise

  render: (component, result) ->
    @_render(@container, component, result)

commonActions =
  clickButton: (div, selector) ->
    selector ?= 'button.btn-primary'
    button = div.querySelector(selector)
    commonActions.click(button)
    button = div.querySelector(selector)

  click: (clickElementNode) ->
    React.addons.TestUtils.Simulate.click(clickElementNode)

  _clickMatch: (selector, args...) ->
    {div} = args[0]
    commonActions.clickButton(div, selector)
    args[0]

  clickMatch: (selector) ->
    (args...) ->
      Promise.resolve(commonActions._clickMatch(selector, args...))

  _focusMatch: (selector, args...) ->
    {div} = args[0]
    elementNode = div.querySelector(selector)
    React.addons.TestUtils.Simulate.focus(elementNode)
    args[0]

  focusMatch: (selector) ->
    (args...) ->
      Promise.resolve(commonActions._focusMatch(selector, args...))

  _fillTextarea: (selector, response, args...) ->
    {div} = args[0]
    selector ?= 'textarea'
    response ?= 'Test Response'

    textarea = div.querySelector(selector)
    textarea.value = response
    React.addons.TestUtils.Simulate.focus(textarea)
    React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    React.addons.TestUtils.Simulate.change(textarea)

    _.defaults(args[0], {textarea})

  fillTextarea: (selector, response) ->
    (args...) ->
      Promise.resolve(commonActions._fillTextarea(selector, response, args...))

module.exports = {routerStub, componentStub, commonActions}
