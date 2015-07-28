React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{History, Link} = require 'react-router'
{TransitionActions, TransitionStore} = require '../../flux/transition'

BackButton = React.createClass
  displayName: 'BackButton'

  propTypes:
    fallbackLink: React.PropTypes.shape(
      to: React.PropTypes.string
      params: React.PropTypes.object
      text: React.PropTypes.string
    ).isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    historyInfo = {}
    hasHistory = (History.length > 1)
    # Only gets previous route transitioned to. Routes from router.replaceWith are ignored.
    # See TransitionStore for more detail.
    historyInfo = TransitionStore.getPrevious(@context.router.match) if hasHistory

    {hasHistory, historyInfo}

  render: ->
    {hasHistory, historyInfo} = @state
    {fallbackLink, className} = @props
    {text} = fallbackLink

    if hasHistory
      backText = 'Back'
      backText = "Back to #{historyInfo.name}" if historyInfo.name
      backButton = <BS.Button className={className} onClick={@context.router.goBack}>
        {backText}
      </BS.Button>
    else
      fallbackLink = _.omit(fallbackLink, 'text')
      classes = 'btn btn-default'
      classes += " #{className}" if className?

      backButton = <Link {...fallbackLink} className={classes}>
        {text}
      </Link>

    backButton

module.exports = BackButton
