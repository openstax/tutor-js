_ = require 'underscore'
expect = chai.expect
React = require 'react'
ReactAddons    = require('react/addons')
ReactTestUtils = React.addons.TestUtils
{Promise}      = require 'es6-promise'
{commonActions} = require './utilities'
sandbox = null
ROUTER = null
CURRENT_ROUTER_PARAMS = null
CURRENT_ROUTER_PATH   = null
CURRENT_ROUTER_QUERY = null
# Mock a router for the context
beforeEach ->
  sandbox = sinon.sandbox.create()
  ROUTER  = sandbox.spy()
  ROUTER.makeHref = sandbox.spy()
  ROUTER.isActive = sandbox.spy()
  ROUTER.transitionTo = sandbox.spy()
  ROUTER.getCurrentPath = sandbox.spy( -> CURRENT_ROUTER_PATH )
  ROUTER.getCurrentQuery = sandbox.spy( -> CURRENT_ROUTER_QUERY )
  ROUTER.getLocation = sandbox.spy( ->
    addChangeListener: sandbox.spy()
    removeChangeListener: sandbox.spy()
  )
  ROUTER.match = sandbox.spy()
  ROUTER.getCurrentParams = sandbox.spy( -> CURRENT_ROUTER_PARAMS )
afterEach ->
  sandbox.restore()

# A wrapper component to setup the router context
Wrapper = React.createClass
  childContextTypes:
    router: React.PropTypes.func
  getChildContext: ->
    router: ROUTER
  render: ->
    React.createElement(@props._wrapped_component,
      _.extend(_.omit(@props, '_wrapped_component'), ref: 'element')
    )

Testing = {

  renderComponent: (component, options = {}) ->
    options.props ||= {}
    CURRENT_ROUTER_PARAMS = options.routerParams or {}
    CURRENT_ROUTER_QUERY = options.routerQuery or {}
    CURRENT_ROUTER_PATH   = options.routerPath   or '/'
    root = document.createElement('div')
    promise = new Promise( (resolve, reject) ->
      props = _.clone(options.props)
      props._wrapped_component = component
      wrapper = React.render( React.createElement(Wrapper, props), root )
      resolve({
        root,
        wrapper,
        element: wrapper.refs.element,
        dom: React.findDOMNode(wrapper.refs.element)
      })
    )
    # defer adding the then callback so it'll be called after whatever is attached after the return
    _.defer -> promise.then ->
      React.unmountComponentAtNode(root)
      CURRENT_ROUTER_PATH   = '/'
      CURRENT_ROUTER_PARAMS = {}
      return arguments
    promise

  actions: commonActions

}

# Hide the router behind a defined property so it can access the ROUTER variable that's set in the beforeEach
Object.defineProperty(Testing, 'router', {
  get: -> ROUTER
})

module.exports = {Testing, expect, sinon, React, _, ReactTestUtils}
