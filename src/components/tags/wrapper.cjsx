React = require 'react'
BS = require 'react-bootstrap'

TagWrapper = React.createClass

  propTypes:
    label: React.PropTypes.string.isRequired

  render: ->
    <BS.Col sm=2>
      <label>
        <div className="label">{@props.label}</div>
        {@props.children}
      </label>
    </BS.Col>


module.exports = TagWrapper
