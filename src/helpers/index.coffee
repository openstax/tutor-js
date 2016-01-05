React = require 'react'
_ = require 'underscore'

TABBABLE_SELECTORS = ['a', 'button', 'input', 'form', 'textarea', '[tabindex]']
TABBABLE_CLASS = 'openstax-tabbable'
UNTABBABLE_CLASS = 'openstax-untabbable'

helpers =

  wrapComponent: (component) ->
    render: (DOMNode, props = {}) ->
      React.render React.createElement(component, props), DOMNode
    unmountFrom: React.unmountComponentAtNode

  setTabbing: (tabbableParentDom, containerDom) ->
    tabbablesSelector = TABBABLE_SELECTORS.join(',')
    untabbablesSelector = TABBABLE_SELECTORS.join(":not(.#{TABBABLE_CLASS}),")
    untabbablesSelector = "#{untabbablesSelector}:not(.#{TABBABLE_CLASS})"

    tabbables = tabbableParentDom.querySelectorAll(tabbablesSelector)
    _.each(tabbables, (tabbable) ->
      tabbable.classList.add(TABBABLE_CLASS)
    )

    untabbables = containerDom.querySelectorAll(untabbablesSelector)
    _.each(untabbables, (untabbable) ->
      untabbable.classList.add(UNTABBABLE_CLASS)
    )

  unsetTabbing: (tabbableParentDom, containerDom) ->
    tabbablesSelector = ".#{TABBABLE_CLASS}"
    untabbablesSelector = ".#{UNTABBABLE_CLASS}"

    tabbables = tabbableParentDom.querySelectorAll(tabbablesSelector)
    _.each(tabbables, (tabbable) ->
      tabbable.classList.remove(TABBABLE_CLASS)
    )

    untabbables = containerDom.querySelectorAll(untabbablesSelector)
    _.each(untabbables, (untabbable) ->
      untabbable.classList.remove(UNTABBABLE_CLASS)
    )

module.exports = helpers
