React = require 'react'

module.exports = React.createClass
  displayName: 'ChapterSection'
  propTypes:
    section: React.PropTypes.array.isRequired
  render: ->
    <span>
      {@props.section[0]}.{@props.section[1]}
    </span>

