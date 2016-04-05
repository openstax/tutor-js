React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'
_ = require 'underscore'

{ExerciseActions, ExerciseStore} = require '../stores/exercise'
Exercise = require './exercise'


ExerciseWrapper = React.createClass

  getInitialState: ->
    {}

  componentDidMount: ->
    if @props.exerciseId
      this.refs.exerciseId.getDOMNode().value = @props.exerciseId
      @loadExercise()

  publishExercise: ->
    if confirm('Are you sure you want to publish?')
      ExerciseActions.save(@state.exerciseId)
      ExerciseActions.publish(@state.exerciseId)

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
        ExerciseActions.create(id, ExerciseStore.get(@getId()))
      else
        ExerciseActions.save(id)

  render: ->
    classes = classnames('exercise', 'openstax', 'container-fluid',
      {'is-loading': ExerciseStore.isLoading()}
    )

    <div className={classes}>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <BS.ButtonToolbar className="navbar-btn">
              <BS.Button bsStyle="primary" onClick={@addNew}>New</BS.Button>
              <BS.Button bsStyle="primary" onClick={@saveExercise}>Save Draft</BS.Button>
              <BS.Button bsStyle="primary" onClick={@publishExercise}>Publish</BS.Button>
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

module.exports = ExerciseWrapper
