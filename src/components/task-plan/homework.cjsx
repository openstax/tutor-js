React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

HomeworkPlan = React.createClass
  render: ->
    <div>Create Homework!</div>

module.exports = {HomeworkPlan}
