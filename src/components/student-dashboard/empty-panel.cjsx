React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass

  displayName: 'EmptyPanel'

  render: ->
    content = @props.children or "No events this week"
    <BS.Panel header={@props.title}>
      <div className="empty">{content}</div>
    </BS.Panel>
