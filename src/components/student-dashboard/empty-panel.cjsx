React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass

  displayName: 'EmptyPanel'

  render: ->
    content = @props.children or "No events this week"
    <BS.Panel className="empty" header={@props.title}>
      {content}
    </BS.Panel>
