React = require 'react'
TutorLink = require '../link'

{ViewingAsStudentName} = require './viewing-as-student-name'


TeacherReviewControls = React.createClass
  displayName: 'TeacherReviewControls'
  render: ->
    {courseId, taskId} = @props

    <div className='task-teacher-review-controls'>
      <ViewingAsStudentName
        key='viewing-as'
        courseId={courseId}
        taskId={taskId}
      />
      <TutorLink
        to='viewScores'
        key='step-back'
        params={{courseId}}
        className='btn btn-default'>
          Back to Scores
      </TutorLink>
    </div>

module.exports = TeacherReviewControls
