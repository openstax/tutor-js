React = require 'react'

_ = require 'underscore'
trim = require 'lodash/trim'
BS = require 'react-bootstrap'

NetworkActivity = require 'components/network-activity-spinner'


Search = React.createClass
  propTypes:
    location: React.PropTypes.object.isRequired

  getInitialState: ->
    showEmptyWarning: false

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  update: -> @forceUpdate()

  checkIsEmpty: (searchQuery) ->
    isEmpty = _.isEmpty(trim(searchQuery))
    @setState(showEmptyWarning: isEmpty)
    isEmpty

  updateLoading: (searchQuery) ->
    @setState(loading: trim(searchQuery))

  loadExercise: (exerciseId) ->
    @updateLoading(exerciseId)
    ExerciseStore.once 'loaded', =>
      @props.location.onRecordLoad('exercises', exerciseId, ExerciseStore) if ExerciseStore.get(exerciseId)
    ExerciseActions.load(exerciseId)

  onFindExercise: ->
    return if @checkIsEmpty(this.refs.exerciseId.value)
    @loadExercise(this.refs.exerciseId.value)

  onExerciseKeyPress: (ev) ->
    ev.persist()
    _.defer =>
      return if @checkIsEmpty(@refs.exerciseId.value)
      if ev.key is 'Enter'
        @loadExercise(@refs.exerciseId.value)
        ev.preventDefault()
      else
        @updateLoading(@refs.exerciseId.value)

  clearError: ->
    @setState(error: null)

  Errors: ->
    return null unless @state.error
    <BS.Alert bsStyle="danger" onDismiss={@clearError}>
      <p>{@state.error}</p>
    </BS.Alert>

  render: ->
    <div className="search">
      {<NetworkActivity /> if ExerciseStore.isLoading(@state.loading) }
      {<h3>Search is empty, please type an exercise ID into the input.</h3> if @state.showEmptyWarning}
      <@Errors />

      <h1>Edit exercise:</h1>

      <BS.Row>
        <BS.Col sm=3>
          <div className="input-group">
            <input type="text" autoFocus
              className="form-control"
              onKeyDown={@onExerciseKeyPress}
              ref="exerciseId" placeholder="Exercise ID"/>
            <span className="input-group-btn">
              <button className="btn btn-default load"
                type="button" onClick={@onFindExercise}
              >Load</button>
            </span>
          </div>
        </BS.Col>
      </BS.Row>
    </div>


module.exports = Search
