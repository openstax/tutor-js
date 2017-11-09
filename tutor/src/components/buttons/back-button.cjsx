React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Router = require '../../helpers/router'
TutorLink = require '../link'

{TransitionActions, TransitionStore} = require '../../flux/transition'

BackButton = React.createClass
  displayName: 'BackButton'

  propTypes:
    fallbackLink: React.PropTypes.shape(
      to: React.PropTypes.string
      params: React.PropTypes.object
      text: React.PropTypes.string
    ).isRequired

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

    <TutorLink primaryBtn to={to}>
      {backText}
    </TutorLink>

module.exports = BackButton
