require 'react-hot-loader/patch'

React          = require 'react'
ReactDOM       = require 'react-dom'
{AppContainer} = require 'react-hot-loader'
indexOf        = require 'lodash/indexOf'
pickBy         = require 'lodash/pickBy'
concat         = require 'lodash/concat'
some           = require 'lodash/some'
kebabCase      = require 'lodash/kebabCase'

getBaseName = (context) -> kebabCase(context.constructor.displayName)


PASSABLE_PROPS = ['className', 'id', 'children', 'target', 'ref', 'tabIndex', 'role']
PASSABLE_PREFIXES = ['data-', 'aria-', 'on']
filterProps = (props, options = {}) ->
  pickBy props, (prop, name) ->

    indexOf(concat(PASSABLE_PROPS, options.props or []), name) > -1 or
      some(concat(PASSABLE_PREFIXES, options.prefixes or []), (prefix) ->
        name.indexOf(prefix) is 0
      )

renderRoot = (getComponent, rootEl) ->
  unless rootEl
    rootEl = document.createElement('div')
    rootEl.id = 'ox-react-root-container'
    document.body.appendChild(rootEl)

  render = ->
    Root = getComponent()
    ReactDOM.render(
      React.createElement(AppContainer, {}, React.createElement(Root))
    , rootEl)

  render()
  return render

module.exports = {getBaseName, filterProps, renderRoot}
