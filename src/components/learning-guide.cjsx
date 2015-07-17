React = require 'react'

{LearningGuideStudentStore, LearningGuideStudentActions} = require '../flux/learning-guide-student'
{LearningGuideTeacherStore, LearningGuideTeacherActions} = require '../flux/learning-guide-teacher'

LoadableItem = require './loadable-item'

Teacher = require './learning-guide/teacher'
Student = require './learning-guide/student'

LearningGuideStudentShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={LearningGuideStudentStore}
      actions={LearningGuideStudentActions}
      renderItem={-> <Student courseId={courseId} />}
    />


LearningGuideTeacherShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={LearningGuideTeacherStore}
      actions={LearningGuideTeacherActions}
      renderItem={-> <Teacher courseId={courseId} />}
    />

module.exports = {LearningGuideStudentShell, LearningGuideTeacherShell}
