React = require 'react'
map = require 'lodash/map'
UserMenu = require('../../models/user/menu').default

SUPPORT_LINK_PARAMS = '&cu=1&fs=ContactUs&q='

makeContactMessage = (status, message, request = { method: 'unknown', url: '' }) ->
  userAgent = window.navigator.userAgent
  location = window.location.href

  errorInfo = "#{status} with #{message} for #{request.method} on #{request.url}"

  if request.data?
    errorInfo += " with\n#{request.data}"

  template = """Hello!
    I ran into a problem on
    #{userAgent} at #{location}.

    Here is some additional info:
    #{errorInfo}."""

makeContactURL = (supportLinkBase, status, message, request) ->
  q = encodeURIComponent(makeContactMessage(status, message, request))
  "#{supportLinkBase}#{SUPPORT_LINK_PARAMS}#{q}"

ServerErrorMessage = React.createClass
  displayName: 'ServerErrorMessage'

  propTypes:
    status: React.PropTypes.number
    statusMessage: React.PropTypes.string
    config: React.PropTypes.object
    supportLinkBase: React.PropTypes.string
    debug: React.PropTypes.bool

  getDefaultProps: ->
    supportLinkBase: UserMenu.helpURL
    debug: true

  render: ->
    {status, statusMessage, config, supportLinkBase, debug, data} = @props
    statusMessage ?= 'No response was received'
    q = makeContactMessage(status, statusMessage, config)

    errorsMessage =
      <span>
        {if data?.errors then map(data.errors, 'code').join(', ') else statusMessage}
      </span>

    dataMessage = <span>
      with <pre>{config.data}</pre>
    </span> if config.data?

    debugInfo = [
      <p key='error-note'>Additional error messages returned from the server is:</p>
      <pre key='errors' className='response'>{errorsMessage}</pre>
      <div key='request' className='request'>
        <kbd>{config.method}</kbd> on {config.url} {dataMessage}
      </div>
    ] if debug

    errorMessage =
      <div className='server-error'>
        <h3>An error with code {status} has occured</h3>
        <p>Please visit <a target='_blank'
          href={makeContactURL(supportLinkBase, status, statusMessage, config)}
        >our support page</a> to file a bug report.
        </p>
        {debugInfo}
      </div>

module.exports = ServerErrorMessage
