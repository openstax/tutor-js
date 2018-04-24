React = require 'react'
_ = require 'underscore'
TutorLink = require './link'
cn = require 'classnames'

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
    externalStyle: React.PropTypes.bool

  render: ->
    {children, className } = @props

    linkProps = _.omit(@props, 'children')

    <TutorLink
      {...linkProps}
      className={cn(className, 'external-icon': @props.externalStyle)}
    >
      {children}
    </TutorLink>

module.exports = NewTabLink
