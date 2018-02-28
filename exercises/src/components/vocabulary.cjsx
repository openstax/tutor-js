React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Location = require 'stores/location'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'
Distractors = require 'components/vocabulary/distractors'
Tags = require 'components/vocabulary/tags'
ExercisePreview = require 'components/exercise/preview'
NetworkActivity = require 'components/network-activity-spinner'
RecordNotFound  = require 'components/record-not-found'
BSFieldGroup = require 'shared/components/bs-field-group'

Vocabulary = React.createClass
  propTypes:
    id:   React.PropTypes.string.isRequired
    location: React.PropTypes.object

  setTerm: (ev) ->
    VocabularyActions.change(@getVocabId(), term: ev.target.value)

  setDefinition: (ev) ->
    VocabularyActions.change(@getVocabId(), definition: ev.target.value)

  update: -> @forceUpdate()

  componentWillMount: ->
    VocabularyStore.addChangeListener(@update)
    @loadIfNeeded( @getVocabId() )

  componentWillReceiveProps: (nextProps) ->
    @loadIfNeeded( ExerciseStore.get(nextProps.id)?.vocab_term_uid )

  loadIfNeeded: (vocabId) ->
    if vocabId and not ( VocabularyStore.get(vocabId) or VocabularyStore.isLoading(vocabId) )
      VocabularyActions.load(vocabId)

  componentWillUnmount: ->
    VocabularyStore.removeChangeListener(@update)

  getVocabId: ->
    ExerciseStore.get(@props.id)?.vocab_term_uid

  render: ->
    vocabId = @getVocabId()
    return null unless vocabId

    vocabTerm = VocabularyStore.getFromExerciseId(@props.id)
    unless vocabTerm
      return <RecordNotFound recordType="Vocabulary Term" id={vocabId} />

    <div className='vocabulary-editor'>

      <div className="editing-controls">

        <BS.Row>
          <BS.Col sm=6>
            <BSFieldGroup
              id="key-term"
              type="text"
              label="Key Term"
              onChange={@setTerm} value={vocabTerm.term}
            />
            <BSFieldGroup
              id="key-term-def"
              type="textarea"
              label="Key Term Definition"
              onChange={@setDefinition} value={vocabTerm.definition}
            />

          </BS.Col>
          <BS.Col sm=6>
            <Distractors termId={vocabId} />
          </BS.Col>
        </BS.Row>

        <BS.Row>
          <BS.Col sm=12>
            <h4>Tags</h4>
          </BS.Col>
        </BS.Row>
        <Tags vocabularyId={vocabId} />

      </div>

      <ExercisePreview exerciseId={@props.id} />
      <div className="vocabulary-hidden-id">{vocabId}</div>
    </div>


module.exports = Vocabulary
