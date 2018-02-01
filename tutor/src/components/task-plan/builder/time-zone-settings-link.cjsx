React  = require 'react'
BS     = require 'react-bootstrap'

TutorLink = require '../../link'

{default: Courses} = require '../../../models/courses-map'

TimeZoneSettingsLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.object

  render: ->
    tooltip =
      <BS.Tooltip id='change-course-time'>
        Click to change course time zone
      </BS.Tooltip>
    <TutorLink
      className='course-time-zone'
      to='courseSettings'
      query={ tab: 1 }
      params={courseId: @props.courseId}
    >
      <BS.OverlayTrigger placement='top' overlay={tooltip}>
        <span>{Courses.get(@props.courseId).time_zone}</span>
      </BS.OverlayTrigger>
    </TutorLink>



module.exports = TimeZoneSettingsLink
