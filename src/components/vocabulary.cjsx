React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Location = require 'stores/location'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'
Distractors = require 'components/vocabulary/distractors'
Tags = require 'components/vocabulary/tags'

Vocabulary = React.createClass
  propTypes:
    id:   React.PropTypes.string.isRequired
    location: React.PropTypes.object

  setTerm: (ev) -> VocabularyActions.change(@props.id, term: ev.target.value)
  setDefinition: (ev) -> VocabularyActions.change(@props.id, definition: ev.target.value)

  update: -> @forceUpdate()

  componentWillMount: ->
    VocabularyStore.addChangeListener(@update)

  componentWillUnmount: ->
    VocabularyStore.removeChangeListener(@update)

  visitExercise: ->
    exerciseIds = VocabularyStore.getExerciseIds(@props.id)
    if (exerciseIds.length)
      @props.location.visitExercise(exerciseIds[0])

  render: ->
    vt = VocabularyStore.get(@props.id)
    if not vt
      return null

    linkToExercise = <p>
      <a onClick={@visitExercise}>
        Go to Exercise <i className="fa fa-chevron-right" />
      </a>
    </p> if VocabularyStore.hasExercise(@props.id)

    <div className='vocabulary-editor'>

      <BS.Row>
        <BS.Col sm=6>
          { linkToExercise }
          <BS.Input type="text" label="Key Term" onChange={@setTerm} value={vt.term} />

          <BS.Input type="textarea" label="Key Term Definition"
            onChange={@setDefinition} value={vt.definition} />

        </BS.Col>
        <BS.Col sm=6>
          <Distractors termId={@props.id} />
        </BS.Col>
      </BS.Row>

      <BS.Row>
        <BS.Col sm=12>
          <h4>Tags</h4>
        </BS.Col>
      </BS.Row>
      <Tags vocabularyId={@props.id} />
    </div>


module.exports = Vocabulary
