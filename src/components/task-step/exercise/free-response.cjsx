React = require 'react'
{TaskStepStore} = require '../../../flux/task-step'

FreeResponse = React.createClass
  displayName: 'FreeResponse'
  propTypes:
    id: React.PropTypes.string.isRequired
    free_response: React.PropTypes.string.isRequired

  getDefaultProps: ->
    free_response: ''

  render: ->
    {id, free_response} = @props
    FreeResponse = null

    if TaskStepStore.hasFreeResponse(id) and free_response.length
      FreeResponse = <div className='free-response'><p>{free_response}</p></div>

    FreeResponse

module.exports = FreeResponse
