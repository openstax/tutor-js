React = require 'react'
Router = require 'react-router-dom'

Router = require '../../helpers/router'
DesktopImage = require './desktop-image'
{CourseStore}  = require '../../flux/course'

CCDashboardEmptyPeriod = React.createClass

  displayName: 'CCDashboardEmptyPeriod'

  propTypes:
    courseId: React.PropTypes.string

  render: ->
    courseId = @props.courseId or Router.currentParams().courseId
    course =  CourseStore.get(courseId)
    <div className="empty-period cc-dashboard-help">
      <h3>
        Once students begin working through Concept Coach question sets,
        this dashboard will show insights into your students’ performance.
      </h3>
      <div className='svg-container'>
        <DesktopImage courseId={courseId} />
      </div>
    </div>


module.exports = CCDashboardEmptyPeriod
