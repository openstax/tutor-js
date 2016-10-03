React = require 'react'
BS = require 'react-bootstrap'

UPGRADE = <a target="_blank" href="https://support.apple.com/downloads/safari">Safari version 10</a>
CHROME  = <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a>
FIREFOX = <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>

SafariWarning = React.createClass
  propTypes:
    windowImpl: React.PropTypes.object

  getDefaultProps: ->
    windowImpl: window

  getInitialState: ->
    match = @props.windowImpl.navigator.userAgent.match(/Version\/([\d\.]+)\sSafari/)
    isShown: match and parseFloat(match[1]) < 10

  onDismiss: ->
    @setState(isShown: false)

  render: ->
    return null unless @state.isShown

    <BS.Alert bsStyle="danger" className="safari-warning" onDismiss={@onDismiss}>
      <p>
        Versions of Safari earlier than 10 have a bug that causes it to crash and lose answered exercises.
      </p>
      <p>
        Please either upgrade to {UPGRADE} or use an alternative browser such as {CHROME} or {FIREFOX}
      </p>
    </BS.Alert>

module.exports = SafariWarning
