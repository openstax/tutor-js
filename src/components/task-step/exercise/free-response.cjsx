React = require 'react'

FreeResponse = React.createClass
  displayName: 'FreeResponse'
  propTypes:
    free_response: React.PropTypes.string.isRequired

  getDefaultProps: ->
    free_response: ''

  render: ->
    {free_response, student_names} = @props
    FreeResponse = null

    studentNames = student_names.join(', ') if student_names?

    if free_response? and free_response.length
      FreeResponse = <div className='free-response' data-student-names="#{studentNames}">
        <div className='free-response-content'>{free_response}</div>
      </div>

    FreeResponse

module.exports = FreeResponse
