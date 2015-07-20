React = require 'react'

LearningGuide = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
TeacherComponent = require './learning-guide/teacher'
StudentComponent = require './learning-guide/student'
TeacherStudentComponent = require './learning-guide/teacher-student'
{PerformanceStore, PerformanceActions} = require '../flux/performance'

Student = React.createClass
  displayName: 'LearningGuideStudentShell'

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={LearningGuide.Student.store}
      actions={LearningGuide.Student.actions}
      renderItem={-> <StudentComponent courseId={courseId} />}
    />


# The teacher student store depends on both the
# performance report store as well as the teacher student learning guide
TeacherStudent = React.createClass
  displayName: 'LearningGuideTeacherStudentShell'

  contextTypes:
    router: React.PropTypes.func

  loadPerformanceReport: ->
    {courseId, roleId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={PerformanceStore}
      actions={PerformanceActions}
      renderItem={-> <TeacherStudentComponent courseId={courseId} roleId={roleId}/>}
    />

  render: ->
    {courseId, roleId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      options={{roleId}}
      roleId={roleId} # HACK: force loadableItem to re-render
      store={LearningGuide.TeacherStudent.store}
      actions={LearningGuide.TeacherStudent.actions}
      renderItem={@loadPerformanceReport}
    />


Teacher = React.createClass
  displayName: 'LearningGuideTeacherShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={LearningGuide.Teacher.store}
      actions={LearningGuide.Teacher.actions}
      renderItem={-> <TeacherComponent courseId={courseId} />}
    />

module.exports = {Teacher, TeacherStudent, Student}
