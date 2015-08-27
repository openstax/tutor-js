React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Name = require '../name'
BindStoreMixin = require '../bind-store-mixin'
LearningGuide = require '../../flux/learning-guide'
{PerformanceStore} = require '../../flux/performance'

Guide = require './guide'
InfoLink = require './info-link'

module.exports = React.createClass
  displayName: 'LearningGuideTeacherStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  mixins: [BindStoreMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string.isRequired

  getInitialState: ->
    roleId: @props.roleId

  componentWillMount: ->
    LearningGuide.TeacherStudent.actions.load(@props.courseId, {roleId: @props.roleId})

  bindStore: LearningGuide.TeacherStudent.store

  onSelectStudent: (roleId) ->
    {courseId} = @props
    LearningGuide.TeacherStudent.actions.load(courseId, {roleId})
    @setState({roleId})
    @context.router.transitionTo('viewStudentTeacherGuide', {courseId, roleId})

  renderHeading: ->
    students = PerformanceStore.getAllStudents(@props.courseId)
    selected = PerformanceStore.getStudent(@props.courseId, @state.roleId)
    return null unless selected
    name = <Name {...selected} />
    <div className='guide-heading'>
      <div className='guide-group-title'>
        Performance Forecast for:
        <BS.DropdownButton bzSize='large' className='student-selection' title={name}
          bsStyle='link' onSelect={@onSelectStudent}>
            { for student in _.sortBy(students, 'name') when student.role isnt selected.role
              <BS.MenuItem key={student.role} eventKey={student.role}>
                <Name {...student} />
              </BS.MenuItem> }
        </BS.DropdownButton>
        <InfoLink type='teacher_student'/>
      </div>
      <Router.Link activeClassName='' to='viewPerformance'
        className='btn btn-default back'
        params={courseId: @props.courseId}>
        Return to Performance Report
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
    isLoaded = LearningGuide.TeacherStudent.store.isLoaded.bind(LearningGuide.TeacherStudent.store, courseId, {roleId})
    isLoading = LearningGuide.TeacherStudent.store.isLoading.bind(LearningGuide.TeacherStudent.store, courseId, {roleId})

    <BS.Panel className='learning-guide teacher-student'>
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
        allSections={LearningGuide.TeacherStudent.store.getAllSections(courseId, {roleId})}
        chapters={LearningGuide.TeacherStudent.store.getChapters(courseId, {roleId}) }
      />
    </BS.Panel>
