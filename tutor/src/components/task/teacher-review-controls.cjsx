React = require 'react'
Router = require 'react-router'

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
      <Router.Link
        to='viewScores'
        key='step-back'
        params={{courseId}}
        className='btn btn-default'>
          Back to Scores
      </Router.Link>
    </div>

module.exports = TeacherReviewControls
