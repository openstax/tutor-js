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
BrowseTheBook = require '../buttons/browse-the-book'

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
    params: React.PropTypes.object

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

          <BS.Col xs=12 md=8 lg=9>
            <BS.Tabs
              activeKey = {@state.selectedTabIndex}
              onSelect  = {@selectTab}
              animation = {false}>
              <BS.Tab eventKey={1} title='This Week'>
                <ThisWeekPanel courseId={courseId}/>
                <UpcomingPanel courseId={courseId}/>
              </BS.Tab>
              <BS.Tab eventKey={2} title='All Past Work'>
                <AllEventsByWeek courseId={courseId}/>
              </BS.Tab>
            </BS.Tabs>
          </BS.Col>

          <BS.Col xs=12 md=4 lg=3>
            <ProgressGuideShell courseId={courseId} sampleSizeThreshold=3 />
            <div className='actions-box'>
              <BrowseTheBook unstyled courseId={courseId}>
                <div>Browse the Book</div>
              </BrowseTheBook>
            </div>
          </BS.Col>

        </BS.Row>
      </div>
    </div>
