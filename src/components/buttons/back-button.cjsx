React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{History, Link} = require 'react-router'
{TransitionActions, TransitionStore} = require '../../flux/transition'

BackButton = React.createClass
  displayName: 'BackButton'

  propTypes:
    bsStyle: React.PropTypes.string
    fallbackLink: React.PropTypes.shape(
      to: React.PropTypes.string
      params: React.PropTypes.object
      text: React.PropTypes.string
    ).isRequired

  getDefaultProps: ->
    bsStyle: 'default'

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

    <Link className={"btn btn-#{@props.bsStyle}"} to={href}>
      {backText}
    </Link>

module.exports = BackButton
