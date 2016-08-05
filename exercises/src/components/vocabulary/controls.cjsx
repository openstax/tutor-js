React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Location = require 'stores/location'
{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'
{ExerciseActions} = require 'stores/exercise'

AsyncButton = require 'shared/src/components/buttons/async-button.cjsx'
{SuretyGuard} = require 'shared'

VocabularyControls = React.createClass

  propTypes:
    id:   React.PropTypes.string.isRequired
    location: React.PropTypes.object

  update: -> @forceUpdate()

  componentWillMount: ->
    VocabularyStore.addChangeListener(@update)
    VocabularyStore.on('updated', @onUpdated)

  componentWillUnmount: ->
    VocabularyStore.removeChangeListener(@update)
    VocabularyStore.off('updated', @onUpdated)

  saveVocabulary: ->
    vocabId = @getVocabId()
    if VocabularyStore.isNew(vocabId)
      VocabularyActions.create(vocabId, VocabularyStore.get(vocabId))
    else
      VocabularyActions.save(vocabId)

  onUpdated: ->
    vocab = VocabularyStore.getFromExerciseId(@props.id)
    exId = _.last(vocab.exercise_uids)
    {id} = @props.location.getCurrentUrlParts()
    if id is exId
      ExerciseActions.load(exId)
    else
      @props.location.visitVocab(exId) # update URL with new version

  publishVocabulary: ->
    VocabularyActions.publish(@getVocabId())

  isVocabularyDirty: ->
    vocabId = @getVocabId()
    vocabId and VocabularyStore.isChanged(vocabId)

  getVocabId: ->
    ExerciseStore.get(@props.id)?.vocab_term_uid

  # render nothing for now, maybe a header message or something later?
  render: ->

    {id} = @props
    vocabTerm = VocabularyStore.getFromExerciseId(@props.id)
    return null unless vocabTerm
    vocabId = @getVocabId()

    guardProps =
      onlyPromptIf: @isVocabularyDirty
      placement: 'right'
      message: "You will lose all unsaved changes"

    <div className="vocabulary-navbar-controls">
      <BS.ButtonToolbar className="navbar-btn">

        <AsyncButton
          bsStyle='info'
          className='draft'
          onClick={@saveVocabulary}
          disabled={not VocabularyStore.isSavable(vocabId)}
          isWaiting={VocabularyStore.isSaving(vocabId)}
          waitingText='Saving...'
          isFailed={VocabularyStore.isFailed(vocabId)}
          >
          Save Draft
        </AsyncButton>

        { unless VocabularyStore.isNew(vocabId)
          <SuretyGuard
            onConfirm={@publishVocabulary}
            okButtonLabel='Publish'
            placement='right'
            message="Once a vocabulary term is published, it is available for use as an exercise. "
          >
            <AsyncButton
              bsStyle='primary'
              className='publish'
              disabled={not VocabularyStore.isPublishable(vocabId)}
              isWaiting={VocabularyStore.isPublishing(vocabId)}
              waitingText='Publishing...'
              isFailed={VocabularyStore.isFailed(vocabId)}
            >
              Publish
            </AsyncButton>
          </SuretyGuard>
        }
      </BS.ButtonToolbar>
    </div>

module.exports = VocabularyControls
