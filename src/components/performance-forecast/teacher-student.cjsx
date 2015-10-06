React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Name = require '../name'
BindStoreMixin = require '../bind-store-mixin'
PerformanceForecast = require '../../flux/performance-forecast'
{ScoresStore} = require '../../flux/scores'

Guide = require './guide'
InfoLink = require './info-link'

module.exports = React.createClass
  displayName: 'PerformanceForecastTeacherStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  mixins: [BindStoreMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string.isRequired

  getInitialState: ->
    roleId: @props.roleId

  componentWillMount: ->
    PerformanceForecast.TeacherStudent.actions.load(@props.courseId, {roleId: @props.roleId})

  bindStore: PerformanceForecast.TeacherStudent.store

  onSelectStudent: (roleId) ->
    {courseId} = @props
    PerformanceForecast.TeacherStudent.actions.load(courseId, {roleId})
    @setState({roleId})
    @context.router.transitionTo('viewStudentTeacherPerformanceForecast', {courseId, roleId})

  renderHeading: ->
    students = ScoresStore.getAllStudents(@props.courseId)
    selected = ScoresStore.getStudent(@props.courseId, @state.roleId)
    return null unless selected
    name = <Name {...selected} />
    <div className='guide-heading'>
      <div className='guide-group-title'>
        <span className='preamble'>Performance Forecast for:</span>
        <BS.DropdownButton bzSize='large' className='student-selection' title={name}
          bsStyle='link' onSelect={@onSelectStudent}>
            { for student in _.sortBy(students, 'name') when student.role isnt selected.role
              <BS.MenuItem key={student.role} eventKey={student.role}>
                <Name {...student} />
              </BS.MenuItem> }
        </BS.DropdownButton>
        <InfoLink type='teacher_student'/>
      </div>
      <Router.Link activeClassName='' to='viewScores'
        className='btn btn-default back'
        params={courseId: @props.courseId}>
        Return to Scores
      </Router.Link>
    </div>

  renderWeakerExplanation: ->
    <div className='explanation'>
      <p>Tutor shows the weakest topics for a student.</p>
      <p>Your help may be needed in these areas.</p>
    </div>

  returnToDashboard: ->
    @context.router.transitionTo('viewTeacherDashBoard', {courseId: @props.courseId})

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
        isLoaded={isLoaded}
        isLoading={isLoading}
        loadingMessage="Loading..."
        heading={@renderHeading()}
        weakerExplanation={@renderWeakerExplanation()}
        emptyMessage={@renderEmptyMessage()}
        weakerTitle="Their weakest topics"
        weakerEmptyMessage="Your student hasn't worked enough problems for Tutor to predict their weakest topics."
        sampleSizeThreshold={3}
        onReturn={@returnToDashboard}
        allSections={PerformanceForecast.TeacherStudent.store.getAllSections(courseId, {roleId})}
        chapters={PerformanceForecast.TeacherStudent.store.getChapters(courseId, {roleId}) }
      />
    </BS.Panel>
