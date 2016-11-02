# coffeelint: disable=max_line_length
React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'

# Approx how wide each char is in the text input
# it's width will be set to this * link's character count
CHAR_WIDTH = 7

StudentEnrollmentLink = React.createClass

  propTypes:
    period: React.PropTypes.object.isRequired

  selectText: (ev) ->
    ReactDOM.findDOMNode(@refs.input).select()

  render: ->
    <span className='enrollment-code-link' onClick={@selectText}>
      <span className="title">Student Enrollment URL:</span>
      <input type="text"
        ref='input'
        style={width: (@props.period.enrollment_url?.length or 20) * CHAR_WIDTH}
        value={@props.period.enrollment_url}
        readOnly />
    </span>

module.exports = StudentEnrollmentLink
