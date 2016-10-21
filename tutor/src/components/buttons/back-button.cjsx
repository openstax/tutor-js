React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Router = require '../../helpers/router'
TutorLink = require '../link'

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

  render: ->
    # Gets route to last path that was not the same as the current one
    # See TransitionStore for more detail.
    historyInfo = TransitionStore.getPrevious()
    {fallbackLink, className} = @props
    {text} = fallbackLink

    backText = if historyInfo?.name then "Back to #{historyInfo.name}" else fallbackLink.text

    to =  historyInfo?.path or Router.makePathname(
      @props.fallbackLink.to, @props.fallbackLink.params
    )
    console.log historyInfo, to
    <TutorLink className={"btn btn-#{@props.bsStyle}"} to={to}>
      {backText}
    </TutorLink>

module.exports = BackButton
