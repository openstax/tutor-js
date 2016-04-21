React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Exercise = require './exercise'
ErrorModal = require './error-modal'
MPQToggle = require './mpq-toggle'
SuretyGuard = require './surety-guard'

{ExerciseActions, ExerciseStore} = require '../stores/exercise'
AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'

module.exports = React.createClass
  displayName: 'App'
  getInitialState: ->
    exerciseId: null

  setBrowserUrlId: (id) ->
    window.history.pushState({}, "Exercise Editor", "/exercises/#{id}")

  update: -> @forceUpdate()

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  componentDidMount: ->
    if @props.exerciseId is 'new'
      @addNew()
    else if @props.exerciseId
      @loadExercise(_.first @props.exerciseId.split('@'))

  publishExercise: ->
    ExerciseActions.publish(@state.exerciseId)

  addNew: ->
    id = ExerciseStore.freshLocalId()
    template = ExerciseStore.getTemplate()
    ExerciseActions.loaded(template, id)
    @setState({exerciseId: id })

  loadExercise: (exerciseId) ->
    @setState({exerciseId})
    ExerciseActions.load(exerciseId)
    @setBrowserUrlId(exerciseId)

  onFindExercise: ->
    @loadExercise(this.refs.exerciseId.getDOMNode().value)

  onFindKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadExercise(this.refs.exerciseId.getDOMNode().value)
    ev.preventDefault()

  renderExerciseOrLoad: ->
    if @state.exerciseId
      <MPQToggle exerciseId={@state.exerciseId} />
    else
      <div className="input-group">
        <input type="text" className="form-control" onKeyPress={@onFindKeyPress}
          ref="exerciseId" placeholder="Exercise ID"/>
        <span className="input-group-btn">
          <button className="btn btn-default load" type="button" onClick={@onFindExercise}>Load</button>
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
    if ExerciseStore.isNew(id)
      ExerciseStore.once 'created', @loadExercise
      ExerciseActions.create(id, ExerciseStore.get(id))
    else
      ExerciseActions.save(id)

  onNewBlank: (ev) ->
    ev.preventDefault()
    @setBrowserUrlId('new')
    @addNew()

  onReset: (ev) ->
    ev.preventDefault()
    @setBrowserUrlId('')
    @replaceState({})

  isExerciseDirty: ->
    @state.exerciseId and ExerciseStore.isChanged(@state.exerciseId)

  render: ->
    id = @state.exerciseId
    guardProps =
      onlyPromptIf: @isExerciseDirty
      placement: 'right'
      message: "You will lose all unsaved changes"

    classes = classnames('exercise', 'openstax', 'container-fluid',
      {'is-loading': ExerciseStore.isLoading()}
    )

    <div className={classes}>
      <ErrorModal />
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <BS.ButtonToolbar className="navbar-btn">
              <SuretyGuard
                onConfirm={@onReset}
                {...guardProps}
              >
                <a href="/exercises" className="btn btn-danger back">Back</a>
              </SuretyGuard>
              <SuretyGuard
                onConfirm={@onNewBlank}
                {...guardProps}
              >
                <a className="btn btn-success blank">New Blank Exercise</a>
              </SuretyGuard>
              { if id?
                <AsyncButton
                  bsStyle='info'
                  className='draft'
                  onClick={@saveExercise}
                  disabled={not ExerciseStore.isSavable(id)}
                  isWaiting={ExerciseStore.isSaving(id)}
                  waitingText='Saving...'
                  isFailed={ExerciseStore.isFailed(id)}
                  >
                  Save Draft
                </AsyncButton>
              }
              { if id and not ExerciseStore.isNew(id)
                <SuretyGuard
                  onConfirm={@publishExercise}
                  okButtonLabel='Publish'
                  placement='right'
                  message="Once an exericse is published, it is available for use."
                >
                  <AsyncButton
                    bsStyle='primary'
                    className='publish'
                    disabled={not ExerciseStore.isPublishable(id)}
                    isWaiting={ExerciseStore.isPublishing(id)}
                    waitingText='Publishing...'
                    isFailed={ExerciseStore.isFailed(id)}
                    >
                    Publish
                  </AsyncButton>
                </SuretyGuard>
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
