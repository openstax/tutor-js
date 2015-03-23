React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

PracticeButton = require '../practice-button'

PracticeEnd = React.createClass
  render: ->
    footer = 
      <div>
        <PracticeButton courseId={@props.courseId} actionText="Do more practice" loadedTaskId={@props.taskId} reloadPractice={@props.reloadPractice} forceCreate="true"/>
        <Router.Link to="dashboard" className="btn btn-primary">Back to Dashboard</Router.Link>
      </div>

    <div className="task task-completed">
      {@props.breadcrumbs}
      <BS.Panel bsStyle="default" footer={footer}>
        <h1>You earned a star!</h1>
        <h3>Great Job!</h3>
      </BS.Panel>
    </div>

module.exports = PracticeEnd