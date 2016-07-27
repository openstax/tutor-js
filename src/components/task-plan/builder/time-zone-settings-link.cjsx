React  = require 'react'
Router = require 'react-router'
BS     = require 'react-bootstrap'

{CourseStore} = require '../../../flux/course'

TimeZoneSettingsLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  render: ->
    tooltip =
      <BS.Tooltip id='change-course-time'>
        Click to change course time zone
      </BS.Tooltip>
    <Router.Link
      className='course-time-zone'
      to='courseSettings'
      params={courseId: @props.courseId}
    >
      <BS.OverlayTrigger placement='top' overlay={tooltip}>
        <span>{CourseStore.getTimezone(@props.courseId)}</span>
      </BS.OverlayTrigger>
    </Router.Link>



module.exports = TimeZoneSettingsLink
