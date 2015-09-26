React = require 'react'

LearningGuide = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
TeacherComponent = require './learning-guide/teacher'
StudentComponent = require './learning-guide/student'
TeacherStudentComponent = require './learning-guide/teacher-student'
{ScoresStore, ScoresActions} = require '../flux/scores'

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
      isLong={true}
    />


# The teacher student store depends on both the
# scores report store as well as the teacher student learning guide
TeacherStudent = React.createClass
  displayName: 'LearningGuideTeacherStudentShell'

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId, roleId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={ScoresStore}
      actions={ScoresActions}
      renderItem={-> <TeacherStudentComponent courseId={courseId} roleId={roleId}/>}
      isLong={true}
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
      isLong={true}
    />

module.exports = {Teacher, TeacherStudent, Student}
