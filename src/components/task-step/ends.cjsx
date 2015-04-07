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
      <BS.Panel bsStyle="default" footer={footer} className='-practice-completed'>
        <h1>You earned a star!</h1>
        <h3>Great Job!</h3>
      </BS.Panel>
    </div>

HomeworkEnd = React.createClass
  render: ->
    footer = <Router.Link to="dashboard" className="btn btn-primary">Back to Dashboard</Router.Link>

    <div className="task task-completed">
      {@props.breadcrumbs}
      <BS.Panel bsStyle="default" footer={footer} className='-homework-completed'>
        <h1>Turn in your homework.</h1>
        <h3>Great Job!</h3>
      </BS.Panel>
    </div>

TaskEnd = React.createClass
  render: ->
    footer = <Router.Link to="dashboard" className="btn btn-primary">Back to Dashboard</Router.Link>

    <div className="task task-completed">
      {@props.breadcrumbs}
      <BS.Panel bsStyle="default" footer={footer} className='-task-completed'>
        <h1>You Are Done.</h1>
        <h3>Great Job!</h3>
      </BS.Panel>
    </div>

module.exports = {task: TaskEnd, homework: HomeworkEnd, practice: PracticeEnd}