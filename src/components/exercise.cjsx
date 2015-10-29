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
  updateNumber: (event) -> ExerciseActions.updateNumber(@getId(), event.target?.value)
  updateStimulus: (event) -> ExerciseActions.updateStimulus(@getId(), event.target?.value)
  updateTags: (event) ->
    tagsArray = event.target?.value.split(",")
    ExerciseActions.updateTags(@getId(), tagsArray)

  getId: -> @props.id or prompt('Enter exercise id:')

  renderLoading: ->
    <div>Loading exercise: {@getId()}</div>

  render: ->
    id = @getId()
    if not ExerciseStore.get(id)
      if not ExerciseStore.isLoading(id) then ExerciseActions.load(id)
      return @renderLoading()

    questions = []
    for question in ExerciseStore.getQuestions(id)
      questions.push(<Question id={question.id} />)

    <div>
      <div>
        <label>Exercise ID {ExerciseStore.getId(id)}</label>
      </div><div>
        <label>Exercise Number</label>
        <input onChange={@updateNumber} value={ExerciseStore.getNumber(id)}/>
      </div><div>
        <label>Exercise Stimulus</label>
        <textarea onChange={@updateStimulus}>{ExerciseStore.getStimulus(id)}</textarea>
      </div>
      {questions}
      <div>
        <label>Tags</label>
        <textarea onChange={@updateTags}>{ExerciseStore.getTags(id).join(',')}</textarea>
      </div>
    </div>

