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
{ArbitraryHtmlAndMath, ExercisePreview} = require 'openstax-react-components'
AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'


Exercise = React.createClass
  exerciseId:   React.PropTypes.string.isRequired

  getInitialState: -> {}
  update: -> @setState({})

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  sync: -> ExerciseActions.sync(@getId())

  #   if (not @props.id)
  #     @setState({
  #       id: prompt('Enter exercise id:')
  #     })
  #   ExerciseStore.addChangeListener(@update)

  # updateNumber: (event) -> ExerciseActions.updateNumber(@getId(), event.target?.value)
  # updateStimulus: (event) -> ExerciseActions.updateStimulus(@getId(), event.target?.value)

  # getId: ->
  #   @props.id or @state.id

  # getDraftId: (id) ->
  #   draftId = if id.indexOf("@") is -1 then id else id.split("@")[0]
  #   "#{draftId}@d"

  # saveExercise: ->
  #   if confirm('Are you sure you want to save?')

  #     ExerciseActions.save(@getId())

  # publishExercise: ->
  #   if confirm('Are you sure you want to publish?')
  #     ExerciseActions.save(@getId())
  #     ExerciseActions.publish(@getId())

  # renderLoading: ->
  #   <div>Loading exercise: {@getId()}</div>

  # renderFailed: ->
  #   <div>Failed loading exercise, please check id</div>

  # renderForm: ->
  #   id = @getId()

  #   questions = []
  #   for question in ExerciseStore.getQuestions(id)
  #     questions.push(<Question key={question.id} sync={@sync} id={question.id} />)

  #   isWorking = ExerciseStore.isSaving(id) or ExerciseStore.isPublishing(id)

  #   if not ExerciseStore.isPublished(id)
  #     publishButton = <AsyncButton
  #       bsStyle='primary'
  #       onClick={@publishExercise}
  #       disabled={isWorking}
  #       isWaiting={ExerciseStore.isPublishing(id)}
  #       waitingText='Publishing...'
  #       isFailed={ExerciseStore.isFailed(id)}
  #       >
  #       Publish
  #     </AsyncButton>

  #   <div>
  #     <div>
  #       <label>Exercise Number</label>: {ExerciseStore.getNumber(id)}
  #     </div><div>
  #       <label>Exercise Stimulus</label>
  #       <textarea onChange={@updateStimulus} defaultValue={ExerciseStore.getStimulus(id)}>
  #       </textarea>
  #     </div>
  #     {questions}
  #     <ExerciseTags id={id} />
  #     <AsyncButton
  #       bsStyle='info'
  #       onClick={@saveExercise}
  #       disabled={isWorking}
  #       isWaiting={ExerciseStore.isSaving(id)}
  #       waitingText='Saving...'
  #       isFailed={ExerciseStore.isFailed(id)}
  #       >
  #       Save
  #     </AsyncButton>
  #     {publishButton}
  #   </div>


  renderMpqTabs: ->
    {questions} = ExerciseStore.get(@props.exerciseId)
    for question, i in questions
      <BS.TabPane key={i} eventKey={"question-#{i}"} tab={"Question #{i+1}"}>
        <Question id={question.id} sync={@sync} />
      </BS.TabPane>

  renderSingleQuestionTab: ->
    {questions} = ExerciseStore.get(@props.exerciseId)
    <BS.TabPane key={0} eventKey='question-0' tab='Question'>
      <Question id={_.first(questions)?.id} sync={@sync} />
    </BS.TabPane>

  previewTag: ->
    content = _.compact([tag.name, tag.description]).join(' ') or tag.id
    isLO = _.include(['lo', 'aplo'], tag.type)
    {content, isLO}

  onToggleMPQ: (ev) ->
    @setState(isShowingMPQ: ev.target.checked)

  addQuestion: ->
    ExerciseActions.addQuestionPart(@props.exerciseId)

  render: ->
    exercise = ExerciseStore.get(@props.exerciseId)
    return null unless exercise

    <div className="exercise">
      <ExercisePreview extractTag={@previewTag} exercise={tags: exercise.tags, content: exercise} />
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <form className="navbar-form navbar-right" role="search">
            <BS.Input type="checkbox" label="Exercise contains multiple parts"
              checked={@state.isShowingMPQ} wrapperClassName="mpq-toggle" onChange={@onToggleMPQ} />
            {if @state.isShowingMPQ
              <BS.Button onClick={@addQuestion} className="navbar-btn"
                bsStyle="primary">Add Question</BS.Button>}
          </form>
        </div>
      </nav>

      <BS.TabbedArea defaultActiveKey='tags'>
        <BS.TabPane eventKey='tags' tab='Tags'>
          Tags
        </BS.TabPane>
        <BS.TabPane eventKey='assets' tab='Assets'>
          Assets
        </BS.TabPane>
        {if @state.isShowingMPQ then @renderMpqTabs() else @renderSingleQuestionTab()}
      </BS.TabbedArea>
    </div>


    # id = @getId()
    # if not ExerciseStore.get(id) and not ExerciseStore.isFailed(id)
    #   if not ExerciseStore.isLoading(id) then ExerciseActions.load(id)
    #   return @renderLoading()
    # else if ExerciseStore.isFailed(id)
    #   return @renderFailed()

    #

    # exerciseUid = ExerciseStore.getId(id)
    # preview = <Preview exercise={exercise} closePreview={@closePreview}/>

    # if ExerciseStore.isPublished(id)
    #   publishedLabel =
    #     <div>
    #       <label>Published: {ExerciseStore.getPublishedDate(id)}</label>
    #     </div>
    #   editLink =
    #     <div>
    #       <a href="/exercise/#{@getDraftId(id)}">Edit Exercise</a>
    #     </div>
    # else
    #   form = @renderForm(id)

    # <BS.Grid>
    #   <div className="attachments">
    #     { for attachment in ExerciseStore.get(id).attachments || []
    #       <Attachment key={attachment.asset.url} exerciseUid={exerciseUid} attachment={attachment} /> }
    #     <AttachmentChooser exerciseUid={exerciseUid} />
    #   </div>

    #   <BS.Row><BS.Col xs={5} className="exercise-editor">
    #     <div>
    #       <label>Exercise ID:</label> {exerciseUid}
    #     </div>
    #     {publishedLabel}
    #     {editLink}
    #     <form>{form}</form>
    #   </BS.Col><BS.Col xs={6} className="pull-right">
    #     {preview}
    #   </BS.Col></BS.Row>
    # </BS.Grid>

module.exports = Exercise
