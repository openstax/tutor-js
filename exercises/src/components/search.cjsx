React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

NetworkActivity = require 'components/network-activity-spinner'
RecordNotFound  = require 'components/record-not-found'

Search = React.createClass
  propTypes:
    location: React.PropTypes.object.isRequired

  getInitialState: -> {}

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  update: -> @forceUpdate()

  loadExercise: (exerciseId) ->
    @replaceState(loading: exerciseId)
    ExerciseStore.once 'loaded', =>
      @props.location.onRecordLoad('exercises', exerciseId, ExerciseStore) if ExerciseStore.get(exerciseId)

    ExerciseActions.load(exerciseId)

  onFindExercise: ->
    @loadExercise(this.refs.exerciseId.getDOMNode().value)

  onExerciseKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadExercise(this.refs.exerciseId.getDOMNode().value)
    ev.preventDefault()

  render: ->
    <div className="search">
      {<NetworkActivity /> if ExerciseStore.isLoading(@state.loading) }
      {<RecordNotFound
        recordType="Exercise" id={@state.loading}
        /> if ExerciseStore.isFailed(@state.loading)}

      <h1>Edit exercise:</h1>

      <BS.Row>
        <BS.Col sm=3>
          <div className="input-group">
            <input type="text" autoFocus
              className="form-control"
              onKeyPress={@onExerciseKeyPress}
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
