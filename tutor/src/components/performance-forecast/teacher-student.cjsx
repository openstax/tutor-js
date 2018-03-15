React = require 'react'
BS = require 'react-bootstrap'
BackButton = require('../buttons/back-button')
Router = require('../../helpers/router')
_ = require 'underscore'
matches = require 'lodash/matches'

Name = require '../name'
BindStoreMixin = require '../bind-store-mixin'
PerformanceForecast = require '../../flux/performance-forecast'

{default: Courses} = require '../../models/courses-map'
Guide = require './guide'
InfoLink = require './info-link'
ColorKey    = require './color-key'

module.exports = React.createClass
  displayName: 'PerformanceForecastTeacherStudentDisplay'
  contextTypes:
    router: React.PropTypes.object

  mixins: [BindStoreMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string.isRequired

  getInitialState: ->
    roleId: @props.roleId

  componentWillMount: ->
    Courses.get(@props.courseId).roster.ensureLoaded()
    PerformanceForecast.TeacherStudent.actions.load(@props.courseId, {roleId: @props.roleId})

  bindStore: PerformanceForecast.TeacherStudent.store

  onSelectStudent: (roleId, ev) ->
    {courseId} = @props
    PerformanceForecast.TeacherStudent.actions.load(courseId, {roleId})
    @setState({roleId})
    @context.router.history.push(
      Router.makePathname('viewPerformanceGuide', {courseId, roleId})
    )

  renderHeading: ->
    students = Courses.get(@props.courseId).roster.students
    selected = students.find(_.matches({role_id: @state.roleId }))
    return null unless selected
    name = <Name {...selected} />
    <div className='guide-heading'>
      <div className='guide-group-title'>
        <span className='preamble'>Performance Forecast for:</span>
        <BS.DropdownButton
          id='student-selection'
          className='student-selection'
          title={name}
          bsStyle='link'
          onSelect={@onSelectStudent}>
            { for student in _.sortBy(students, 'name') when student.role_id isnt selected.role_id
              <BS.MenuItem key={student.role_id} eventKey={student.role_id}>
                <Name {...student} />
              </BS.MenuItem> }
        </BS.DropdownButton>
        <InfoLink type='teacher_student'/>
      </div>
      <div className='info'>
        <div className='guide-group-key'>
          <ColorKey />
        </div>
        <BackButton
          fallbackLink={{ to: 'dashboard', text: 'Back to Dashboard', params: Router.currentParams() }}
        />
      </div>
    </div>

  renderWeakerExplanation: ->
    <div className='explanation'>
      <p>Tutor shows the weakest topics for a student.</p>
      <p>Your help may be needed in these areas.</p>
    </div>

  renderEmptyMessage: ->
    <div className="no-data-message">
      No questions have been answered yet.
    </div>

  render: ->
    {courseId} = @props
    {roleId} = @state
    isLoaded = PerformanceForecast.TeacherStudent.store.isLoaded.bind(PerformanceForecast.TeacherStudent.store, courseId, {roleId})
    isLoading = PerformanceForecast.TeacherStudent.store.isLoading.bind(PerformanceForecast.TeacherStudent.store, courseId, {roleId})

    <BS.Panel className='performance-forecast teacher-student'>
      <Guide
        courseId={courseId}
        roleId={roleId}
        isLoaded={isLoaded}
        isLoading={isLoading}
        loadingMessage="Loading..."
        heading={@renderHeading()}
        weakerExplanation={@renderWeakerExplanation()}
        emptyMessage={@renderEmptyMessage()}
        weakerTitle="Their weakest topics"
        weakerEmptyMessage="Your student hasn't worked enough problems for Tutor to predict their weakest topics."
        allSections={PerformanceForecast.TeacherStudent.store.getAllSections(courseId, {roleId})}
        chapters={PerformanceForecast.TeacherStudent.store.getChapters(courseId, {roleId}) }
      />
    </BS.Panel>
