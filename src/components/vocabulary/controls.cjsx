React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Location = require 'stores/location'
{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'
{ExerciseActions} = require 'stores/exercise'

AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'
SuretyGuard = require 'components/surety-guard'


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
    if VocabularyStore.isNew(@props.id)
      VocabularyActions.create(@props.id, VocabularyStore.get(@props.id))
    else
      VocabularyActions.save(@props.id)

  onUpdated: ->
    vocab = VocabularyStore.get(@props.id)
    ExerciseActions.load(_.last(vocab.exercise_uids))
    {id} = @props.location.getCurrentUrlParts()
    if id isnt vocab.uid
      @props.location.visitVocab(vocab.uid)

  publishVocabulary: ->
    VocabularyActions.publish(@props.id)

  isVocabularyDirty: ->
    @props.id and VocabularyStore.isChanged(@props.id)

  # render nothing for now, maybe a header message or something later?
  render: ->
    {id} = @props

    guardProps =
      onlyPromptIf: @isVocabularyDirty
      placement: 'right'
      message: "You will lose all unsaved changes"

    <div className="vocabulary-navbar-controls">
      <BS.ButtonToolbar className="navbar-btn">
        { if id?
          <AsyncButton
            bsStyle='info'
            className='draft'
            onClick={@saveVocabulary}
            disabled={not VocabularyStore.isSavable(id)}
            isWaiting={VocabularyStore.isSaving(id)}
            waitingText='Saving...'
            isFailed={VocabularyStore.isFailed(id)}
            >
            Save Draft
          </AsyncButton>
        }
        { unless VocabularyStore.isNew(id)
          <SuretyGuard
            onConfirm={@publishVocabulary}
            okButtonLabel='Publish'
            placement='right'
            message="Once a vocabulary term is published, it is available for use as an exercise. "
          >
            <AsyncButton
              bsStyle='primary'
              className='publish'
              disabled={not VocabularyStore.isPublishable(id)}
              isWaiting={VocabularyStore.isPublishing(id)}
              waitingText='Publishing...'
              isFailed={VocabularyStore.isFailed(id)}
            >
              Publish
            </AsyncButton>
          </SuretyGuard>
        }
      </BS.ButtonToolbar>
    </div>

module.exports = VocabularyControls
