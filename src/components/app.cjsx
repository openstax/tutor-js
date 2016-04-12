React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Exercise = require './exercise'
ErrorModal = require './error-modal'
MPQToggle = require './mpq-toggle'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'
AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'

module.exports = React.createClass
  displayName: 'App'
  getInitialState: ->
    exerciseId: null

  update: -> @forceUpdate()

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  componentDidMount: ->
    if @props.exerciseId is 'new'
      @addNew()
    else if @props.exerciseId
      @loadExercise(@props.exerciseId)

  publishExercise: ->
    if confirm('Are you sure you want to publish?')
      ExerciseActions.save(@state.exerciseId)
      ExerciseActions.publish(@state.exerciseId)


  addNew: ->
    id = ExerciseStore.freshLocalId()
    template = ExerciseStore.getTemplate()
    ExerciseActions.loaded(template, id)
    @setState({exerciseId: id })

  loadExercise: (exerciseId) ->
    @setState({exerciseId})
    ExerciseActions.load(exerciseId)

  onFindExercise: ->
    @loadExercise(this.refs.exerciseId.getDOMNode().value)

  onFindKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadExercise(this.refs.exerciseId.getDOMNode().value)
    ev.preventDefault()

  renderExerciseOrLoad: ->
    if @state.exerciseId and not ExerciseStore.isNew(@state.exerciseId)
      <MPQToggle exerciseId={@props.exerciseId} />
    else
      <div className="input-group">
        <input type="text" className="form-control" onKeyPress={@onFindKeyPress}
          ref="exerciseId" placeholder="Exercise ID"/>
        <span className="input-group-btn">
          <button className="btn btn-default" type="button" onClick={@onFindExercise}>Load</button>
        </span>
      </div>

  renderEditingBody: ->
    return null unless @state.exerciseId
    if ExerciseStore.isLoading()
      <div className="loadable is-loading">Loading...</div>
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
        ExerciseStore.once 'created', @loadExercise

        ExerciseActions.create(id, ExerciseStore.get(id))
      else
        ExerciseActions.save(id)

  onNewBlank: (ev) ->
    ev.preventDefault()
    if @canResetPage('Are you sure you want create a blank Exercise?  You will lose all unsaved changes')
      window.history.pushState({}, "Exercise Editor", "/exercises/new")
      @addNew()

  onReset: (ev) ->
    ev.preventDefault()
    if @canResetPage('Are you sure you want reset editing?  You will lose all unsaved changes')
      window.history.pushState({}, "Exercise Editor", "/exercises/")
      @replaceState({})

  canResetPage: (msg) ->
    not @state.exerciseId or
      not ExerciseStore.isChanged(@state.exerciseId) or
      confirm(msg)


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
              <a href="/exercises" onClick={@onReset} className="btn btn-danger">Reset</a>
              <a href="/exercises/new" onClick={@onNewBlank}
                className="btn btn-success">New Blank Exercise</a>
              { if id?
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
              }
              { if id and not ExerciseStore.isNew(id)
                <AsyncButton
                  bsStyle='primary'
                  onClick={@publishExercise}
                  disabled={not id or isWorking or ExerciseStore.isPublished(id)}
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
