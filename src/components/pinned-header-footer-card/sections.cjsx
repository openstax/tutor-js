React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PinnedHeader = React.createClass
  displayName: 'PinnedHeader'
  render: ->
    {className} = @props
    classes = 'pinned-header'
    classes += " #{className}" if className?

    <div className={classes}>
      {@props.children}
    </div>

PinnedFooter = React.createClass
  displayName: 'PinnedFooter'
  render: ->
    {className} = @props
    classes = 'pinned-footer'
    classes += " #{className}" if className?

    <div className={classes}>
      {@props.children}
    </div>

CardBody = React.createClass
  displayName: 'CardBody'
  render: ->
    {className} = @props
    classes = 'card-body'
    classes += " #{className}" if className?

    <div className={classes}>
      {@props.children}
      <PinnedFooter>
        {@props.footer}
      </PinnedFooter>
    </div>

module.exports = {PinnedHeader, CardBody, PinnedFooter}
