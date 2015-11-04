# @csx React.DOM
React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Question = require './question'
Preview = require './preview'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

{ArbitraryHtmlAndMath} = require 'openstax-react-components'
module.exports = React.createClass
  displayName: 'Exercise'

  getInitialState: -> {}

  componentWillMount: ->
    if (not @props.id)
      @setState({
        id: prompt('Enter exercise id:')
      })
    ExerciseStore.addChangeListener(@update)

  update: -> @setState({})
  updateNumber: (event) -> ExerciseActions.updateNumber(@getId(), event.target?.value)
  updateStimulus: (event) -> ExerciseActions.updateStimulus(@getId(), event.target?.value)
  updateTags: (event) ->
    tagsArray = event.target?.value.split(",")
    ExerciseActions.updateTags(@getId(), tagsArray)

  getId: ->
    @props.id or @state.id

  saveExercise: ->
    if confirm('Are you sure you want to save?')
      ExerciseActions.save(@props.id)

  previewExercise: ->
    @setState({preview: true})

  closePreview: ->
    @setState({preview: false})

  renderLoading: ->
    <div>Loading exercise: {@getId()}</div>

  render: ->
    id = @getId()
    if not ExerciseStore.get(id)
      if not ExerciseStore.isLoading(id) then ExerciseActions.load(id)
      return @renderLoading()

    questions = []
    for question in ExerciseStore.getQuestions(id)
      questions.push(<Question key={question.id} id={question.id} />)

    if @state.preview
      ExerciseActions.sync(id)
      exercise = ExerciseStore.get(id)
      preview = <Preview exercise={exercise} closePreview={@closePreview}/>

    <div>
      <div>
        <label>Exercise ID {ExerciseStore.getId(id)}</label>
      </div><div>
        <label>Exercise Number</label>
        <input onChange={@updateNumber} value={ExerciseStore.getNumber(id)}/>
      </div><div>
        <label>Exercise Stimulus</label>
        <textarea onChange={@updateStimulus} defaultValue={ExerciseStore.getStimulus(id)}>
        </textarea>
      </div>
      {questions}
      <div>
        <label>Tags</label>
        <textarea onChange={@updateTags} defaultValue={ExerciseStore.getTags(id).join(',')}>
        </textarea>
      </div>
      <button onClick={@saveExercise}>Save</button>
      <button onClick={@previewExercise}>Preview</button>

      {preview}
    </div>
