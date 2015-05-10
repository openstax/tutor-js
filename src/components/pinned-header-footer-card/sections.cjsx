React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PinnedHeader = React.createClass
  displayName: 'PinnedHeader'
  render: ->
    <div className='pinned-header'>
      {@props.children}
    </div>

PinnedFooter = React.createClass
  displayName: 'PinnedFooter'
  render: ->
    <div className='pinned-footer'>
      {@props.children}
    </div>

CardBody = React.createClass
  displayName: 'CardBody'
  render: ->
    <div className='card-body'>
      {@props.children}
      <PinnedFooter>
        {@props.footer}
      </PinnedFooter>
    </div>

module.exports = {PinnedHeader, CardBody, PinnedFooter}
