React = require 'react'

module.exports = React.PropTypes.shape(
  title:                    React.PropTypes.string
  children:                 React.PropTypes.array
  chapter_section:          React.PropTypes.array
  clue:                     React.PropTypes.object
  student_count:            React.PropTypes.number
  questions_answered_count: React.PropTypes.number
)
