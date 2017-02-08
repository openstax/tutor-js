React  = require 'react'
BS     = require 'react-bootstrap'

includes = require 'lodash/includes'

DontForgetPanel = require './dont-forget-panel'
EmptyPanel      = require './empty-panel'
UpcomingPanel   = require './upcoming-panel'
AllEventsByWeek = require './all-events-by-week'
ThisWeekPanel   = require './this-week-panel'
PaymentsModal   = require '../payments/modal'
ProgressGuideShell = require './progress-guide'
BrowseTheBook = require '../buttons/browse-the-book'
CourseTitleBanner = require '../course-title-banner'
{CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'
Tabs = require '../tabs'
{NotificationsBar} = require 'shared'
NotificationHelpers = require '../../helpers/notifications'

module.exports = React.createClass
  displayName: 'StudentDashboard'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    params: React.PropTypes.object.isRequired

  getInitialState: ->
    tabIndex: 0

  onTabSelection: (tabIndex, ev) ->
    if includes([0, 1], tabIndex)
      @setState({tabIndex})
    else
      ev.preventDefault()

  renderPastWork: (course) ->
    <div className="tab-pane active">
      <AllEventsByWeek courseId={course.id} isCollege={course.is_college}/>
    </div>


  renderThisWeek: (course) ->
    <div className="tab-pane active">
      <ThisWeekPanel courseId={course.id} isCollege={course.is_college}/>
      <UpcomingPanel courseId={course.id} isCollege={course.is_college}/>
    </div>

  # router context is needed for Navbar helpers
  contextTypes:
    router: React.PropTypes.object

  render: ->
    {courseId} = @props
    course = CourseStore.get(courseId)

    <div className="dashboard">
      <NotificationsBar
        role={CurrentUserStore.getCourseRole(courseId)}
        course={course}
        callbacks={NotificationHelpers.buildCallbackHandlers(@)}
      />
      <CourseTitleBanner courseId={courseId} />
      <PaymentsModal />
      <div className='container'>

        <BS.Row>

          <BS.Col xs=12 md=8 lg=9>
            <Tabs
              params={@props.params}
              onSelect={@onTabSelection}
              tabs={['This Week', 'All Past Work']}
            />

            {if @state.tabIndex is 0 then @renderThisWeek(course) else @renderPastWork(course)}

          </BS.Col>

          <BS.Col xs=12 md=4 lg=3>
            <ProgressGuideShell courseId={courseId} sampleSizeThreshold=3 />
            <div className='actions-box'>
              <BrowseTheBook unstyled courseId={courseId} data-appearance={CourseStore.getAppearanceCode(courseId)}>
                <div>Browse the Book</div>
              </BrowseTheBook>
            </div>
          </BS.Col>

        </BS.Row>
      </div>
    </div>
