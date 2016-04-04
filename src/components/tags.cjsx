React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

FixedTag = React.createClass
  updateTag: (event) ->
    newValue = event.target?.value
    ExerciseActions.updateFixedTag(@props.id, @props.value, newValue)

  renderRangeValue: (value) ->
    optionValue = "#{@props.base}#{@props.separator}#{value}"
    <option key={value} value={optionValue}>{optionValue}</option>

  render: ->
    <select onChange={@updateTag} defaultValue={@props.value}>
      <option value=''>No {@props.base} tag</option>
      {_.map(@props.range, @renderRangeValue)}
    </select>

module.exports = React.createClass
  displayName: 'ExerciseTags'

  updateTags: (event) ->
    tagsArray = event.target?.value.split("\n")
    ExerciseActions.updateTags(@props.id, tagsArray)

  renderFixedTag: (fixedTag) ->
    <FixedTag key={fixedTag.base} id={@props.id} {...fixedTag} />

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

  render: ->
    {id} = @props

    fixed = _.map(ExerciseStore.getFixedTags(id), @renderFixedTag)

    <BS.Row className="tags">
      <p><label>Tags</label></p>
      <BS.Col xs={6}>
        <textarea onChange={@updateTags} defaultValue={ExerciseStore.getEditableTags(id).join('\n')}>
        </textarea>
      </BS.Col>
      <BS.Col xs={6}>
        {fixed}
      </BS.Col>
    </BS.Row>
