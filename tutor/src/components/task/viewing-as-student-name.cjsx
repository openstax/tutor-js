React = require 'react'
classnames = require 'classnames'

Name = require '../name'

{default: Courses} = require '../../models/courses-map'
# {ScoresStore, ScoresActions} = require '../../flux/scores'

ViewingAsStudentName = React.createClass
  displayName: 'ViewingAsStudentName'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    className: React.PropTypes.string

  getInitialState: ->
    @getStudentState()

  getStudentState: (props) ->
    {courseId, taskId} = props or @props
    task = Courses.get(courseId).scores.getTask(taskId)
    if task then { student: task.student } else {}

  updateStudent: (props) ->
    props ?= @props
    @setState(@getStudentState(props))

  componentWillMount: ->
    {courseId, taskId} = @props
    {student} = @state
    scores = Courses.get(courseId).scores
    unless student? or scores.api.hasBeenFetched
      scores.fetch().then(=> @updateStudent())

  componentWillReceiveProps: (nextProps) ->
    @updateStudent(nextProps)

  render: ->
    {className} = @props
    studentName = null
    className = classnames className, 'task-student'
    {student} = @state

    studentName = <div className={className}>
      <Name {...student} />
    </div> if student?

    studentName

module.exports = {ViewingAsStudentName}
