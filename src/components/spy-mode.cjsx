React = require 'react'
classnames = require 'classnames'

SpyModeWrapper = React.createClass

  propTypes:
    onChange: React.PropTypes.func

  getInitialState: ->
    isEnabled: false

  toggleDebug: (ev) ->
    @setState(isEnabled: not @state.isEnabled)
    ev.preventDefault()

  render: ->
    <div className={classnames('debug-content', {'is-enabled': @state.isEnabled})}>
      {@props.children}
      <a href='#spy' onClick={@toggleDebug} className='debug-toggle-link'>&pi;</a>
    </div>

SpyModeContent = React.createClass

  propTypes:
    className: React.PropTypes.string

  render: ->
    <div className={classnames('visible-when-debugging', @props.className)}>
      {@props.children}
    </div>

module.exports = {Content: SpyModeContent, Wrapper:SpyModeWrapper}
