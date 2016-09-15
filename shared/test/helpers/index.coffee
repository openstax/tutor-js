_ = require 'underscore'
expect = chai.expect
React = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{Promise}      = require 'es6-promise'
{commonActions} = require './utilities'
sandbox = null

Wrapper = React.createClass

  render: ->
    React.createElement(@props._wrapped_component,
      _.extend(_.omit(@props, '_wrapped_component', 'children'), ref: 'element')
      @props.children
    )

Testing = {

  renderComponent: (component, options = {}) ->
    options.props ||= {}
    unmountAfter = options.unmountAfter or 5
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
      _.delay( ->
        React.unmountComponentAtNode(root)
      , unmountAfter )
      return arguments
    promise

  actions: commonActions

}

module.exports = {Testing, expect, sinon, React, _, ReactTestUtils}
