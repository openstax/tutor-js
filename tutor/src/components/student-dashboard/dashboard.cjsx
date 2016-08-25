React  = require 'react'
BS     = require 'react-bootstrap'

DontForgetPanel = require './dont-forget-panel'
EmptyPanel      = require './empty-panel'
UpcomingPanel   = require './upcoming-panel'
AllEventsByWeek = require './all-events-by-week'
ThisWeekPanel   = require './this-week-panel'

ProgressGuideShell = require './progress-guide'
BrowseTheBook = require '../buttons/browse-the-book'

CourseDataMixin = require '../course-data-mixin'

{StudentDashboardStore} = require '../../flux/student-dashboard'
{CourseStore} = require '../../flux/course'
Tabs = require '../tabs'

module.exports = React.createClass
  displayName: 'StudentDashboard'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [CourseDataMixin]

  getInitialState: ->
    tabIndex: 0

  onTabSelection: (tabIndex, ev) ->
    if _.include([0, 1], tabIndex)
      @setState({tabIndex})
    else
      ev.preventDefault()

  renderPastWork: (courseId) ->
    <div className="tab-pane active">
      <AllEventsByWeek courseId={courseId}/>
    </div>


  renderThisWeek: (courseId) ->
    <div className="tab-pane active">
      <ThisWeekPanel courseId={courseId}/>
      <UpcomingPanel courseId={courseId}/>
    </div>


  render: ->
    courseId = @props.courseId
    courseDataProps = @getCourseDataProps(courseId)

    info = StudentDashboardStore.get(courseId)
    <div {...courseDataProps} className="tutor-booksplash-background">

      <div className='container'>

        <BS.Row>

          <BS.Col xs=12 md=8 lg=9>
            <Tabs
              onSelect={@onTabSelection}
              tabs={['This Week', 'All Past Work']}
            />

            {if @state.tabIndex is 0 then @renderThisWeek(courseId) else @renderPastWork(courseId)}

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
