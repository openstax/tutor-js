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

  render: ->
    # Gets route to last path that was not the same as the current one
    # See TransitionStore for more detail.
    historyInfo = TransitionStore.getPrevious(@context.router)
    hasHistory = historyInfo.path?
    {fallbackLink, className} = @props
    {text} = fallbackLink

    if hasHistory
      backText = if historyInfo.name then "Back to #{historyInfo.name}"  else 'Back'
      backButton = <BS.Button className={className}
        onClick={=> @context.router.transitionTo(historyInfo.path)}>
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
