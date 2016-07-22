React = require 'react'
Router = require 'react-router'

{CourseStore} = require '../../../flux/course'

TimeZoneSettingsLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  render: ->
    <Router.Link
      className='course-time-zone'
      to='courseSettings'
      params={courseId: @props.courseId}
    >
      {CourseStore.getTimezone(@props.courseId)}
    </Router.Link>



module.exports = TimeZoneSettingsLink
