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
    {fallbackLink, className} = @props
    {text} = fallbackLink

    backText = if historyInfo.name then "Back to #{historyInfo.name}" else fallbackLink.text

    href =  historyInfo.path or @context.router.makeHref(
      @props.fallbackLink.to, @props.fallbackLink.params
    )

    <BS.Button href={href} className={className} {...@props}>
      {backText}
    </BS.Button>

module.exports = BackButton
