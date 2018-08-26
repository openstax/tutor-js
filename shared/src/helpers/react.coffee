React          = require 'react'
ReactDOM       = require 'react-dom'
indexOf        = require 'lodash/indexOf'
pickBy         = require 'lodash/pickBy'
concat         = require 'lodash/concat'
some           = require 'lodash/some'
kebabCase      = require 'lodash/kebabCase'
{detect}       = require 'detect-browser'
{PropTypes: MobxPropTypes} = require 'mobx-react'

PASSABLE_PROPS = ['className', 'id', 'children', 'target', 'ref', 'tabIndex', 'role']
PASSABLE_PREFIXES = ['data-', 'aria-', 'on']
filterProps = (props, options = {}) ->
  pickBy props, (prop, name) ->

    indexOf(concat(PASSABLE_PROPS, options.props or []), name) > -1 or
      some(concat(PASSABLE_PREFIXES, options.prefixes or []), (prefix) ->
        name.indexOf(prefix) is 0
      )

renderRoot = (getComponent, rootEl, props = {}) ->
  unless rootEl
    rootEl = document.createElement('div')
    document.body.appendChild(rootEl)

  rootEl.id = 'ox-react-root-container'
  browser = detect()
  if browser
    rootEl.setAttribute('data-browser', browser.name)
    rootEl.setAttribute('data-browser-version', browser.version)
  rootEl.setAttribute('role', 'main')

  render = ->
    Root = getComponent()
    ReactDOM.render(
      React.createElement(Root, props),
    , rootEl)

  render()
  return render


ArrayOrMobxType = React.PropTypes.oneOfType([
      React.PropTypes.array,
      MobxPropTypes.observableArray,
    ])

idType = React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ])

module.exports = {
  filterProps, renderRoot, ArrayOrMobxType, idType,
}
