React = require 'react'
Router = require 'react-router'

BackButton = React.createClass

  propTypes:
    isEditable: React.PropTypes.bool.isRequired
    getBackToCalendarParams: React.PropTypes.func.isRequired

  render: ->
    return null if @props.isEditable

    backToCalendarParams = @props.getBackToCalendarParams()

    <Router.Link {...backToCalendarParams} className='btn btn-default'>
      Back to Calendar
    </Router.Link>



module.exports = BackButton
