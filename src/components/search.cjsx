React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'


Search = React.createClass
  propTypes:
    history: React.PropTypes.object.isRequired

  displayExercise: (id) ->
    @props.history.push("/exercises/#{id}")

  loadExercise: (exerciseId) ->
    @setState({exerciseId})
    ExerciseStore.once 'loaded', @displayExercise
    ExerciseActions.load(exerciseId)

  onFindExercise: ->
    @loadExercise(this.refs.exerciseId.getDOMNode().value)

  onFindKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadExercise(this.refs.exerciseId.getDOMNode().value)
    ev.preventDefault()

  render: ->
    <div className="search">
      <h1>We be seeeaarching...</h1>
      <BS.Row>
        <BS.Col sm=3>
          <div className="input-group">
            <input type="text" autoFocus
              className="form-control"
              onKeyPress={@onFindKeyPress}
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
