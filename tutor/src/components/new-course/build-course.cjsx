React = require 'react'
BS = require 'react-bootstrap'
Icon = require '../icon'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'


BuildCourse = React.createClass

  componentDidMount: ->
    NewCourseActions.save()

  render: ->
    <div>
      <h4>We’re building your Tutor course…</h4>
      <p>Should take about 10 seconds</p>
      <div className="text-center">
        <Icon type='refresh' spin className="fa-5x" />
      </div>
    </div>


module.exports = BuildCourse
