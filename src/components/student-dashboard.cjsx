React = require 'react'
BS = require 'react-bootstrap'
{StudentDashboardStore, StudentDashboardActions} = require '../flux/student-dashboard'
LoadableItem = require './loadable-item'


DUMMY_COURSE_DATA = {
  type: { tag: "physics", title: "Physics" }
  title: "2nd Period  |  Mr. Andrew Garcia"
}

StudentDashboard = React.createClass
  displayName: 'StudentDashboard'

  contextTypes:
    router: React.PropTypes.func

  renderDashBoard: (courseId)->
    {courseId} = @context.router.getCurrentParams()
    courseInfo = StudentDashboardStore.get(courseId)
    course = DUMMY_COURSE_DATA
    <div className={course.type.tag + " bg"}>
      <div className="container">
        <div className="big-header">{course.type.title}</div>
        <BS.Col xs={12} md={9}>
          <div className="period-title">{course.title}</div>

          <BS.TabbedArea defaultActiveKey={2}>
            <BS.TabPane eventKey={1} tab='This Week'>
              <BS.Panel header='Panel heading without title'>
                HW 7: Vectors & Projectile Motion
                <br/>
                Read Chapter 3-4, 3-7 - 3-9  |  reference view
                <br/>
                Read Chapter 3-1 - 3-3  |  reference view
              </BS.Panel>
              <BS.Panel header="Don't Forget">
                Panel content
              </BS.Panel>

            </BS.TabPane>
            <BS.TabPane eventKey={2} tab='All Work'>
              <BS.Panel header="OCTOBER 5 - OCTOBER 9">
                HW 7: Vectors & Projectile Motion
                <br/>
                Read Chapter 3-4, 3-7 - 3-9  |  reference view
                <br/>
                Read Chapter 3-1 - 3-3  |  reference view
              </BS.Panel>

            </BS.TabPane>
          </BS.TabbedArea>

        </BS.Col>
        <BS.Col xs={12} md={3}>
          <div className="rbox">
            <h3>How am I doing?</h3>
            <BS.Button bsStyle="primary" onClick={@viewWork} className="-view-my-work">
              View All My Work
            </BS.Button>
            <BS.Button bsStyle="primary" onClick={@viewFlightPath} className="-view-flightpath">
              View My Flight Path
            </BS.Button>
          </div>
        </BS.Col>
      </div>
    </div>
  render: ->
    {courseId} = @context.router.getCurrentParams()
    <div className="student-dashboard ">
      <LoadableItem
        id={courseId}
        store={StudentDashboardStore}
        actions={StudentDashboardActions}
        renderItem={=>@renderDashBoard(courseId)}
      />
    </div>

module.exports = {StudentDashboard}
