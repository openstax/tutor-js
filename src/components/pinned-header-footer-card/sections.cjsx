React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PinnedHeader = React.createClass
  displayName: 'PinnedHeader'
  render: ->
    {className} = @props

    <div className="pinned-header #{className}">
      {@props.children}
    </div>

PinnedFooter = React.createClass
  displayName: 'PinnedFooter'
  render: ->
    {className} = @props

    <div className="pinned-footer #{className}">
      {@props.children}
    </div>

CardBody = React.createClass
  displayName: 'CardBody'
  render: ->
    {className} = @props

    <div className="card-body #{className}">
      {@props.children}
      <PinnedFooter>
        {@props.footer}
      </PinnedFooter>
    </div>

module.exports = {PinnedHeader, CardBody, PinnedFooter}
