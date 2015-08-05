React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
LearningGuide = require '../../flux/learning-guide'
{PerformanceStore} = require '../../flux/performance'

Guide = require './guide'
InfoLink = require './info-link'

module.exports = React.createClass
  displayName: 'LearningGuideTeacherStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string.isRequired

  onSelectStudent: (roleId) ->
    {courseId} = @props
    @context.router.transitionTo('viewStudentTeacherGuide', {courseId, roleId})

  renderHeading: ->
    students = PerformanceStore.getAllStudents(@props.courseId)
    selected = PerformanceStore.getStudent(@props.courseId, @props.roleId)
    return null unless selected

    <div className='guide-heading'>
      <div className='student-selection'>Performance Forecast for:
        <BS.DropdownButton bzSize='large' className='student-selection' title={selected.name}
          bsStyle='link' onSelect={@onSelectStudent}>
            { for student in _.sortBy(students, 'name') when student.role isnt selected.role
              <BS.MenuItem key={student.role} eventKey={student.role}>{student.name}</BS.MenuItem> }
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
    {courseId, roleId} = @props

    <BS.Panel className='learning-guide teacher-student'>
      <Guide
        courseId={courseId}
        heading={@renderHeading()}
        weakerExplanation={@renderWeakerExplanation()}
        emptyMessage={@renderEmptyMessage()}
        weakerTitle="Their weakest topics"
        onReturn={@returnToDashboard}
        allSections={LearningGuide.TeacherStudent.store.getAllSections(courseId, {roleId})}
        chapters={LearningGuide.TeacherStudent.store.getChapters(courseId, {roleId}) }
      />
    </BS.Panel>
