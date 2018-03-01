Router = require '../../../src/helpers/router'

_ = require 'underscore'
chai = require('chai')
expect = chai.expect
React = require 'react'
ReactDOM = require 'react-dom'
TestRouter = require './test-router'
ReactTestUtils  = require 'react-addons-test-utils'
SnapShot = require 'react-test-renderer'
{ spyOnComponentMethod, stubComponentMethod } = require 'sinon-spy-react'
{DragDropManager} = require 'dnd-core'
TestBackend = require('react-dnd-test-backend').default
{Provider} = require 'mobx-react'

# No longer exists, needs further investigation if we're using it
# ReactContext   = require('react/lib/ReactContext')

createHistory = require 'history/createMemoryHistory'
{ Router: ReactRouter } = require 'react-router-dom'

{Promise}      = require 'es6-promise'
{commonActions} = require './utilities'
sandbox = null
Sinon = {}


ROUTER = null
CURRENT_ROUTER_PARAMS = null
CURRENT_ROUTER_PATH   = null
CURRENT_ROUTER_QUERY = null
# Mock a router for the context
beforeEach ->
  sandbox = sinon.sandbox.create()
  ROUTER  = new TestRouter

afterEach ->
  sandbox.restore()

# A wrapper component to setup the router context
Wrapper = React.createClass
  childContextTypes:
    router: React.PropTypes.object
    dragDropManager: React.PropTypes.object,

  getChildContext: ->
    router: ROUTER
    dragDropManager: new DragDropManager(TestBackend),

  render: ->
    location = { pathname: '/' }
    props = _.omit(@props, '_wrapped_component', 'injected')
    props.ref = 'element' unless @props.noReference
    body = React.createElement(@props._wrapped_component, props)
    React.createElement(ReactRouter, { history: createHistory.default( initialEntries: ['/dashboard'] ) },
      if @props.injected then React.createElement(Provider, @props.injected, body) else body
    )


Testing = {

  renderComponent: (component, options = {}) ->
    options.props ||= {}
    unmountAfter = options.unmountAfter or 1
    CURRENT_ROUTER_PARAMS = options.routerParams or {}
    CURRENT_ROUTER_QUERY = options.routerQuery or {}
    CURRENT_ROUTER_PATH   = options.routerPath   or '/'
    Router.currentParams.mockReturnValue?(CURRENT_ROUTER_PARAMS)
    Router.currentQuery.mockReturnValue?(CURRENT_ROUTER_QUERY)
    root = document.createElement('div')
    promise = new Promise( (resolve, reject) ->
      props = _.clone(options.props)
      props._wrapped_component = component
      wrapper = ReactDOM.render( React.createElement(Wrapper, props), root )
      resolve({
        root,
        wrapper,
        element: wrapper.refs.element,
        dom: ReactDOM.findDOMNode(wrapper.refs.element)
      })
    )
    # defer adding the then callback so it'll be called after whatever is attached after the return
    _.defer -> promise.then ->
      _.delay( ->
        ReactDOM.unmountComponentAtNode(root)
        CURRENT_ROUTER_PATH   = '/'
        CURRENT_ROUTER_PARAMS = {}
      , unmountAfter )
      return arguments
    promise

  actions: commonActions

  shallowRender: (component) ->
    context = router: ROUTER
#    ReactContext.current = context
    renderer = ReactTestUtils.createRenderer()
    renderer.render(component, context)
    output = renderer.getRenderOutput()
    # ReactContext.current = {}

    output
}

# Hide the router behind a defined property so it can access the ROUTER variable that's set in the beforeEach
Object.defineProperty(Testing, 'router', {
  get: -> ROUTER
})

pause = (scope) ->
  new Promise (resolve) ->
    _.defer ->
      resolve(scope)


module.exports = {
  Testing, sinon, React, ReactDOM, _, ReactTestUtils,
  spyOnComponentMethod, stubComponentMethod,
  SnapShot, pause, Wrapper
}
