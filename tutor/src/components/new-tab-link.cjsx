React = require 'react'
_ = require 'underscore'
TutorLink = require './link'

NewTabLink = React.createClass
  displayName: 'NewTabLink'

  contextTypes:
    router: React.PropTypes.object

  getDefaultProps: ->
    target: '_blank'
    tabIndex: 0

  propTypes:
    to:       React.PropTypes.string.isRequired
    children: React.PropTypes.node.isRequired
    params:   React.PropTypes.object
    query:    React.PropTypes.object
    target:   React.PropTypes.string
    tabIndex: React.PropTypes.number

  render: ->
    {children} = @props

    linkProps = _.omit(@props, 'children')

    <TutorLink {...linkProps}>{children}</TutorLink>

module.exports = NewTabLink
