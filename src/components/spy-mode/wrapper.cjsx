React = require 'react'
classnames = require 'classnames'

SpyModeWrapper = React.createClass

  propTypes:
    onChange: React.PropTypes.func

  getInitialState: ->
    isEnabled: false

  toggleDebug: ->
    @setState(isEnabled: not @state.isEnabled)

  render: ->
    <div className={classnames('debug-content', {'is-enabled': @state.isEnabled})}>
      {@props.children}
      <a href='#' onClick={@toggleDebug} className='debug-toggle-link'>&pi;</a>
    </div>


module.exports = SpyModeWrapper
