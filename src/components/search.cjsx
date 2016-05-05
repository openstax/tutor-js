React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'


Search = React.createClass
  propTypes:
    location: React.PropTypes.object.isRequired

  displayExercise: (id) ->
    @props.location.visitExercise(id)

  displayVocab: (id) ->
    @props.location.visitVocab(id)

  loadExercise: (exerciseId) ->
    @setState({exerciseId})
    ExerciseStore.once 'loaded', @displayExercise
    ExerciseActions.load(exerciseId)

  loadVocabulary: (vocabId) ->
    @setState({vocabId})
    ExerciseStore.once 'loaded', @displayVocab
    ExerciseActions.load(vocabId)

  onFindExercise: ->
    @loadExercise(this.refs.exerciseId.getDOMNode().value)

  onFindVocabulary: ->
    @loadVocabulary(this.refs.vocabularyId.getDOMNode().value)

  onExerciseKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadExercise(this.refs.exerciseId.getDOMNode().value)
    ev.preventDefault()

  onVocabKeyPress: (ev) ->
    return unless ev.key is 'Enter'
    @loadVocabulary(this.refs.vocabularyId.getDOMNode().value)
    ev.preventDefault()

  render: ->
    <div className="search">
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
      <h1>Edit vocabulary term:</h1>
      <BS.Row>
        <BS.Col sm=3>
          <div className="input-group">
            <input type="text"
              className="form-control"
              onKeyPress={@onVocabKeyPress}
              ref="vocabularyId" placeholder="Vocabulary ID"/>
            <span className="input-group-btn">
              <button className="btn btn-default load"
                type="button" onClick={@onFindVocabulary}
              >Load</button>
            </span>
          </div>
        </BS.Col>
      </BS.Row>
    </div>


module.exports = Search
