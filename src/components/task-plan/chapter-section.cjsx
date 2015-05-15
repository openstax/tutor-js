React = require 'react'

module.exports = React.createClass
  displayName: 'ChapterSection'
  propTypes:
    section: React.PropTypes.array.isRequired
  render: ->
    chapter = @props.section[0]
    if @props.section.length is 2
      section = @props.section[1]
    <span className="chapter-section">
      {chapter}{section}
    </span>
