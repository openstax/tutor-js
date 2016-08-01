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

    freeResponseProps =
      className: 'free-response'
    freeResponseProps['data-student-names'] = student_names.join(', ') if student_names?

    if free_response? and free_response.length
      FreeResponse = <div {...freeResponseProps}>
        {free_response}
      </div>

    FreeResponse

module.exports = FreeResponse
