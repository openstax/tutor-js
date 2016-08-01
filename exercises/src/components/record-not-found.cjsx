React = require 'react'

RecordNotFound = React.createClass

  propTypes:
    id: React.PropTypes.string.isRequired
    recordType: React.PropTypes.string.isRequired



  render: ->
    <div className="record-not-found">
      <h3>{@props.recordType} ID: {@props.id} was not found</h3>
    </div>

module.exports = RecordNotFound
