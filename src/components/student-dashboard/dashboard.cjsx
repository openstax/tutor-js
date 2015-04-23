React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'

DontForgetPanel = require './dont-forget-panel'
EmptyPanel      = require './empty-panel'
UpcomingPanel   = require './upcoming-panel'
AllEventsByWeek = require './all-events-by-week'
ThisWeekPanel   = require './this-week-panel'

DUMMY_COURSE_DATA = {
  type: { tag: "physics", title: "Physics" }
  title: "2nd Period  |  Mr. Andrew Garcia"
  endDate: moment('2015-10-20')
}

module.exports = React.createClass
  displayName: 'StudentDashboard'

  contextTypes:
    router: React.PropTypes.func

  render: ->
    courseId = @props.courseId

    course = DUMMY_COURSE_DATA

    <div className={course.type.tag + " bg"}>
      <div className="container">
        <div className="big-header">{course.type.title}</div>
        <BS.Col xs={12} md={9}>
          <div className="period-title">{course.title}</div>

          <BS.TabbedArea animation={false}>

            <BS.TabPane eventKey={1} tab='This Week'>
              <ThisWeekPanel   courseId={courseId}/>
              <DontForgetPanel courseId={courseId}/>
              <UpcomingPanel   courseId={courseId}/>
            </BS.TabPane>

            <BS.TabPane eventKey={2} tab='All Work'>
              <AllEventsByWeek courseId={courseId}/>
            </BS.TabPane>

          </BS.TabbedArea>

        </BS.Col>
        <BS.Col xs={12} md={3}>
          <div className="rbox">
            <h3>How am I doing?</h3>
            <BS.Button
              bsStyle="primary"
              onClick={@viewWork}
              className="-view-my-work"
            >
              View All My Work
            </BS.Button>
            <BS.Button
              bsStyle="primary"
              onClick={@viewFlightPath}
              className="-view-flightpath"
            >
              View My Flight Path
            </BS.Button>
          </div>
        </BS.Col>
      </div>
    </div>
