React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Location = require 'stores/location'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'
Distractors = require 'components/vocabulary/distractors'
Tags = require 'components/vocabulary/tags'
ExercisePreview = require 'components/exercise/preview'

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

  render: ->
    vt = VocabularyStore.get(@props.id)
    return null unless vt


    <div className='vocabulary-editor'>

      <div className="editing-controls">

        <BS.Row>
          <BS.Col sm=6>

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

      <ExercisePreview exerciseId={_.last(vt.exercise_uids)} />
    </div>


module.exports = Vocabulary
