React = require 'react'
ReactTestUtils = require 'react-addons-test-utils'

{Promise} = require 'es6-promise'
_ = require 'underscore'


routerStub =
  container: document.createElement('div')

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

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

commonActions =
  clickButton: (div, selector) ->
    selector ?= 'button.btn-primary'
    button = div.querySelector(selector)
    commonActions.click(button)
    button = div.querySelector(selector)

  click: (clickElementNode, eventData = {}) ->
    ReactTestUtils.Simulate.click(clickElementNode, eventData)

  # http://stackoverflow.com/questions/24140773/could-not-simulate-mouseenter-event-using-react-test-utils
  mouseEnter: (clickElementNode, eventData = {}) ->
    ReactTestUtils.SimulateNative.mouseOver(clickElementNode, eventData)

  mouseLeave: (clickElementNode, eventData = {}) ->
    ReactTestUtils.SimulateNative.mouseOut(clickElementNode, eventData)

  blur: (clickElementNode, eventData = {}) ->
    ReactTestUtils.Simulate.blur(clickElementNode, eventData)

  select: (selectElementNode) ->
    ReactTestUtils.Simulate.select(selectElementNode)

  _clickMatch: (selector, args...) ->
    {div} = args[0]
    commonActions.clickButton(div, selector)
    args[0]

  clickMatch: (selector) ->
    (args...) ->
      Promise.resolve(commonActions._clickMatch(selector, args...))

  _clickComponent: (target, args...) ->
    targetNode = React.findDOMNode(target)
    commonActions.click(targetNode)
    args[0]

  _clickComponentOfType: (targetComponent, args...) ->
    {div, component} = args[0]
    target = ReactTestUtils.findRenderedComponentWithType(component, targetComponent)
    commonActions._clickComponent(target)

  clickComponentOfType: (targetComponent) ->
    (args...) ->
      Promise.resolve(commonActions._clickComponentOfType(targetComponent, args...))

  clickComponent: (targetComponent) ->
    (args...) ->
      Promise.resolve(commonActions._clickComponent(targetComponent, args...))

  _clickDOMNode: (targetNode, args...) ->
    commonActions.click(targetNode)
    args[0]

  clickDOMNode: (targetDOMNode) ->
    (args...) ->
      Promise.resolve(commonActions._clickDOMNode(targetDOMNode, args...))

  _focusMatch: (selector, args...) ->
    {div} = args[0]
    elementNode = div.querySelector(selector)
    ReactTestUtils.Simulate.focus(elementNode)
    args[0]

  focusMatch: (selector) ->
    (args...) ->
      Promise.resolve(commonActions._focusMatch(selector, args...))

  _changeDOMNode: (targetNode, eventData, args...) ->
    ReactTestUtils.Simulate.change(targetNode, eventData)
    args[0]

  _changeMatch: (selector, eventData, args...) ->
    {div} = args[0]
    elementNode = div.querySelector(selector)
    commonActions._changeDOMNode(elementNode, eventData)
    args[0]

  changeMatch: (selector, eventData) ->
    (args...) ->
      Promise.resolve(commonActions._changeMatch(selector, eventData, args...))

  _hoverMatch: (selector, args...) ->
    {div} = args[0]
    elementNode = div.querySelector(selector)
    ReactTestUtils.Simulate.mouseOver(elementNode)
    args[0]

  hoverMatch: (selector) ->
    (args...) ->
      Promise.resolve(commonActions._hoverMatch(selector, args...))

  _fillTextarea: (selector, response, args...) ->
    {div} = args[0]
    selector ?= 'textarea'
    response ?= 'Test Response'

    textarea = div.querySelector(selector)
    textarea.value = response
    ReactTestUtils.Simulate.focus(textarea)
    ReactTestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    ReactTestUtils.Simulate.change(textarea)

    _.defaults(args[0], {textarea})

  fillTextarea: (selector, response) ->
    (args...) ->
      Promise.resolve(commonActions._fillTextarea(selector, response, args...))

  playThroughFunctions: (actionAndCheckFunctions) ->
    (args...) ->
      # perform appropriate step actions for each incomplete step
      # by chaining each promised step action
      # Forces promises to execute in order.  The actions are order dependent
      # so Promises.all will not work in this case.
      actionAndCheckFunctions.reduce((current, next) ->
        current.then(next)
      , Promise.resolve(args...))

module.exports = {componentStub, commonActions}
