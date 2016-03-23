# @csx React.DOM
React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Question = require './question'
Preview = require './preview'
ExerciseTags = require './tags'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'
Attachment = require './attachment'
AttachmentChooser = require './attachment-chooser'
{ArbitraryHtmlAndMath} = require 'openstax-react-components'
AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'

module.exports = React.createClass
  displayName: 'Exercise'

  getInitialState: -> {}

  componentWillMount: ->
    id = if not @props.id then prompt('Enter exercise id:') else @props.id
    if (id.toLowerCase() is 'new')
      id = ExerciseStore.freshLocalId()
      @create(id)

    @setState({id})
    ExerciseStore.addChangeListener(@update)

  update: -> @setState({})
  updateNumber: (event) -> ExerciseActions.updateNumber(@getId(), event.target?.value)
  updateStimulus: (event) -> ExerciseActions.updateStimulus(@getId(), event.target?.value)

  getId: ->
    @state.id or @props.id

  getDraftId: (id) ->
    draftId = if id.indexOf("@") is -1 then id else id.split("@")[0]
    "#{draftId}@d"

  redirect:(id) ->
    window.location = "/exercises/#{id}"

  saveExercise: ->
    validity = ExerciseStore.validate(@getId())
    if not validity?.valid
      alert(validity?.reason or 'Not a valid exercise')
      return

    if confirm('Are you sure you want to save?')
      if ExerciseStore.isNew(@getId())
        ExerciseStore.on 'created', @redirect
        ExerciseActions.create(@getId(), ExerciseStore.get(@getId()))
      else
        ExerciseActions.save(@getId())

  publishExercise: ->
    if confirm('Are you sure you want to publish?')
      ExerciseActions.save(@getId())
      ExerciseActions.publish(@getId())

  renderLoading: ->
    <div>Loading exercise: {@getId()}</div>

  renderFailed: ->
    <div>Failed loading exercise, please check id</div>

  sync: -> ExerciseActions.sync(@getId())

  create: (id) ->
    template = ExerciseStore.getTemplate()
    ExerciseActions.loaded(template, id)

  renderForm: ->
    id = @getId()

    questions = []
    for question in ExerciseStore.getQuestions(id)
      questions.push(<Question key={question.id} sync={@sync} id={question.id} />)

    isWorking = ExerciseStore.isSaving(id) or ExerciseStore.isPublishing(id)

    if not ExerciseStore.isPublished(id) and not ExerciseStore.isNew(id)
      publishButton = <AsyncButton
        bsStyle='primary'
        onClick={@publishExercise}
        disabled={isWorking}
        isWaiting={ExerciseStore.isPublishing(id)}
        waitingText='Publishing...'
        isFailed={ExerciseStore.isFailed(id)}
        >
        Publish
      </AsyncButton>

    <div>
      <div>
        <label>Exercise Number</label>: {ExerciseStore.getNumber(id)}
      </div><div>
        <label>Exercise Stimulus</label>
        <textarea onChange={@updateStimulus} defaultValue={ExerciseStore.getStimulus(id)}>
        </textarea>
      </div>
      {questions}
      <ExerciseTags id={id} />
      <AsyncButton
        bsStyle='info'
        onClick={@saveExercise}
        disabled={isWorking}
        isWaiting={ExerciseStore.isSaving(id)}
        waitingText='Saving...'
        isFailed={ExerciseStore.isFailed(id)}
        >
        Save
      </AsyncButton>
      {publishButton}
    </div>

  render: ->
    id = @getId()

    if not ExerciseStore.get(id) and not ExerciseStore.isFailed(id) and not ExerciseStore.isNew(id)
      if not ExerciseStore.isLoading(id) then ExerciseActions.load(id)
      return @renderLoading()
    else if ExerciseStore.isFailed(id)
      return @renderFailed()

    exercise = ExerciseStore.get(id)

    exerciseUid = ExerciseStore.getId(id)
    preview = <Preview exercise={exercise} closePreview={@closePreview}/>

    if ExerciseStore.isPublished(id)
      publishedLabel =
        <div>
          <label>Published: {ExerciseStore.getPublishedDate(id)}</label>
        </div>
      editLink =
        <div>
          <a href="/exercise/#{@getDraftId(id)}">Edit Exercise</a>
        </div>
    else
      form = @renderForm(id)

    if not ExerciseStore.isNew(id)
      attachments = <div className="attachments">
        { for attachment in ExerciseStore.get(id).attachments
          <Attachment key={attachment.asset.url} exerciseUid={exerciseUid} attachment={attachment} /> }
        <AttachmentChooser exerciseUid={exerciseUid} />
      </div>
      addExerciseBtn = <p className="btn btn-success add-exercise">
        <a href="/exercises/new">
          <i className="fa fa-plus-circle" />Add New Exercise
        </a>
      </p>

    <BS.Grid>
      <BS.Row><BS.Col xs={5} className="exercise-editor">
        <div>
          <label>Exercise ID:</label> {exerciseUid}
        </div>
        {publishedLabel}
        {editLink}
        <form>{form}</form>
      </BS.Col><BS.Col xs={6} className="pull-right">
        { addExerciseBtn }
        { preview }
        { attachments }
      </BS.Col></BS.Row>
    </BS.Grid>
