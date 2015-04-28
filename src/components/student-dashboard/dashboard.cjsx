React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
_ = require 'underscore'
DontForgetPanel = require './dont-forget-panel'
EmptyPanel      = require './empty-panel'
UpcomingPanel   = require './upcoming-panel'
AllEventsByWeek = require './all-events-by-week'
ThisWeekPanel   = require './this-week-panel'

{StudentDashboardStore} = require '../../flux/student-dashboard'

module.exports = React.createClass
  displayName: 'StudentDashboard'

  propTypes:
    courseId: React.PropTypes.any.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    selectedTabIndex: 1

  viewFlightPath: ->
    @context.router.transitionTo('viewGuide', {courseId: @props.courseId})

  selectTab: (index) ->
    this.setState(selectedTabIndex:index)

  render: ->
    courseId = @props.courseId
    info = StudentDashboardStore.get(courseId)
    {longTitle, shortTitle} = StudentDashboardStore.getTitles(courseId)

    <div className={shortTitle.toLowerCase() + " bg"}>
      <div className="container">
        <div className="big-header">{shortTitle}</div>
        <BS.Col xs={12} md={9}>
          <div className="course-title">{longTitle}</div>

          <BS.TabbedArea
            activeKey = {@state.selectedTabIndex}
            onSelect  = {@selectTab}
            animation = {false}>

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
              onClick={_.partial(@selectTab, 2)}
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
