React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Exercise = require './exercise'
ErrorModal = require './error-modal'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'
AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'

module.exports = React.createClass
  displayName: 'App'
  getInitialState: -> {}

  componentDidMount: ->
    if @props.exerciseId is 'new'
      @addNew()
    else if @props.exerciseId
      this.refs.exerciseId.getDOMNode().value = @props.exerciseId
      @loadExercise()

  publishExercise: ->
    if confirm('Are you sure you want to publish?')
      ExerciseActions.save(@state.exerciseId)
      ExerciseActions.publish(@state.exerciseId)

  redirect:(id) ->
    window.location = "/exercises/#{id}"

  addNew: ->
    id = ExerciseStore.freshLocalId()
    template = ExerciseStore.getTemplate()
    ExerciseActions.loaded(template, id)
    @setState({exerciseId: id })

  loadExercise: ->
    exerciseId = this.refs.exerciseId.getDOMNode().value
    @setState({exerciseId})
    ExerciseActions.load(exerciseId)

  onFindKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadExercise()
    ev.preventDefault()

  renderExerciseOrLoad: ->
    if @state.exerciseId and not ExerciseStore.isNew(@state.exerciseId)
      <div>Exercise ID: {@state.exerciseId}</div>
    else
      <div className="input-group">
        <input type="text" className="form-control" onKeyPress={@onFindKeyPress}
          ref="exerciseId" placeholder="Exercise ID"/>
        <span className="input-group-btn">
          <button className="btn btn-default" type="button" onClick={@loadExercise}>Load</button>
        </span>
      </div>

  renderEditingBody: ->
    return null unless @state.exerciseId
    if ExerciseStore.isLoading()
      <div>Loading...</div>
    else
      <Exercise exerciseId={@state.exerciseId} />

  saveExercise: ->
    id = @state.exerciseId
    validity = ExerciseStore.validate(id)
    if not validity?.valid
      alert(validity?.reason or 'Not a valid exercise')
      return

    if confirm('Are you sure you want to save?')
      if ExerciseStore.isNew(id)
        ExerciseStore.on 'created', @redirect
        ExerciseActions.create(id, ExerciseStore.get(id))
      else
        ExerciseActions.save(id)

  render: ->
    id = @state.exerciseId
    classes = classnames('exercise', 'openstax', 'container-fluid',
      {'is-loading': ExerciseStore.isLoading()}
    )

    isWorking = ExerciseStore.isSaving(id) or ExerciseStore.isPublishing(id)

    <div className={classes}>
      <ErrorModal />
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <BS.ButtonToolbar className="navbar-btn">
              <a href="/exercises/new" className="btn btn-success">New Exercise</a>
              <AsyncButton
                bsStyle='info'
                onClick={@saveExercise}
                disabled={isWorking}
                isWaiting={ExerciseStore.isSaving(id)}
                waitingText='Saving...'
                isFailed={ExerciseStore.isFailed(id)}
                >
                Save Draft
              </AsyncButton>
              { if not ExerciseStore.isNew(id)
                <AsyncButton
                  bsStyle='primary'
                  onClick={@publishExercise}
                  disabled={isWorking}
                  isWaiting={ExerciseStore.isPublishing(id)}
                  waitingText='Publishing...'
                  isFailed={ExerciseStore.isFailed(id)}
                  >
                  Publish
                </AsyncButton>
              }
            </BS.ButtonToolbar>
          </div>

          <form className="navbar-form navbar-right" role="search">
            <div className="form-group">
              {@renderExerciseOrLoad()}
            </div>
          </form>
        </div>
      </nav>
      {@renderEditingBody()}
    </div>
