React = require 'react'

LearningGuide = require '../flux/learning-guide'
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
      store={LearningGuide.Student.store}
      actions={LearningGuide.Student.actions}
      renderItem={-> <Student courseId={courseId} />}
    />


LearningGuideTeacherShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={LearningGuide.Teacher.store}
      actions={LearningGuide.Teacher.actions}
      renderItem={-> <Teacher courseId={courseId} />}
    />

module.exports = {LearningGuideStudentShell, LearningGuideTeacherShell}
