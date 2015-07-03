React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
_ = require 'underscore'
DontForgetPanel = require './dont-forget-panel'
EmptyPanel      = require './empty-panel'
UpcomingPanel   = require './upcoming-panel'
AllEventsByWeek = require './all-events-by-week'
ThisWeekPanel   = require './this-week-panel'

PracticeButton = require '../buttons/practice-button'
{GuideDashboardProgressShell} = require '../guide-dashboard-progress'
BrowseBookButton = require '../buttons/browse-the-book'
{StudentDashboardStore} = require '../../flux/student-dashboard'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'StudentDashboard'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    selectedTabIndex: 1

  viewFlightPath: ->
    @context.router.transitionTo('viewGuide', {courseId: @props.courseId})

  selectTab: (index) ->
    @setState(selectedTabIndex:index)

  render: ->
    courseId = @props.courseId
    info = StudentDashboardStore.get(courseId)
    # The large background image is currently set via CSS based on
    # the short title of the course, which will be something like 'Physics'
    <div className="tutor-booksplash-background"
      data-title={CourseStore.getShortName(courseId)}
      data-category={CourseStore.getCategory(courseId)}>

      <div className='container'>

        <BS.Row>
          <BS.Col mdPush={9} xs={12} md={3}>

            <BS.Row>
              <div className='right-actions-box'>
                <BrowseBookButton courseId={courseId} />
              </div>
            </BS.Row>

            <BS.Row>
              <div className='right-actions-box bottom'>
                <GuideDashboardProgressShell courseId={courseId} />
                <BS.Button
                  bsStyle='primary'
                  onClick={@viewFlightPath}
                  className='-view-flightpath'
                >
                  View My Learning Guide
                </BS.Button>
              </div>
            </BS.Row>

            <div className='right-actions-box'>
              <BrowseBookButton unstyled courseId={courseId}>
                <div>Browse the Book</div>
              </BrowseBookButton>

            </div>
          </BS.Col>

          <BS.Col mdPull={3} xs={12} md={9}>

            <BS.TabbedArea
              activeKey = {@state.selectedTabIndex}
              onSelect  = {@selectTab}
              animation = {false}>

              <BS.TabPane eventKey={1} tab='This Week'>
                <ThisWeekPanel courseId={courseId}/>
                <UpcomingPanel courseId={courseId}/>
              </BS.TabPane>

              <BS.TabPane eventKey={2} tab='All Past Work'>
                <AllEventsByWeek courseId={courseId}/>
              </BS.TabPane>

            </BS.TabbedArea>

          </BS.Col>
        </BS.Row>
      </div>
    </div>
