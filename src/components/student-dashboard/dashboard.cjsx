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
ProgressGuideShell = require './progress-guide'
BrowseBookButton = require '../buttons/browse-the-book'

CourseDataMixin = require '../course-data-mixin'

{StudentDashboardStore} = require '../../flux/student-dashboard'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'StudentDashboard'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [CourseDataMixin]

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    selectedTabIndex: 1

  selectTab: (index) ->
    @setState(selectedTabIndex:index)

  render: ->
    courseId = @props.courseId
    courseDataProps = @getCourseDataProps(courseId)

    info = StudentDashboardStore.get(courseId)
    # The large background image is currently set via CSS based on
    # the short title of the course, which will be something like 'Physics'
    <div {...courseDataProps} className="tutor-booksplash-background">

      <div className='container'>

        <BS.Row>
          <BS.Col xs=12 md=4 lg=3 mdPush=8 lgPush=9>

            <ProgressGuideShell courseId={courseId} />

            <div className='actions-box'>
              <BrowseBookButton unstyled courseId={courseId}>
                <div>Browse the Book</div>
              </BrowseBookButton>

            </div>
          </BS.Col>

          <BS.Col xs=12 md=8 lg=9 mdPull=4 lgPull=3>

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
