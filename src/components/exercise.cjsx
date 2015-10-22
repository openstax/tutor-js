# @csx React.DOM
React = require 'react'
_ = require 'underscore'
Question = require './question'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

module.exports = React.createClass
  displayName: 'Exercise'

  getInitialState: -> {}

  componentWillMount: -> ExerciseStore.addChangeListener(@update)

  update: -> @setState({})

  render: ->
    questions = []
    for question in ExerciseStore.getQuestions(@props.config)
      questions.push(<Question model={question} parent={@props.config} />)

    <div>
      <div>
        <label>Exercise ID {ExerciseStore.getId(@props.config)}</label>
      </div><div>
        <label>Exercise Number</label>
        <input value={ExerciseStore.getNumber(@props.config)}/>
      </div><div>
        <label>Exercise Stimulus</label>
        <textarea>{ExerciseStore.getStimulus(@props.config)}</textarea>
      </div>
      {questions}
      <div>
        <label>Tags</label>
        <textarea>{ExerciseStore.getTags(@props.config).join(',')}</textarea>
      </div>
    </div>

