React = require 'react'
BS = require 'react-bootstrap'
Location = require 'stores/location'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'

AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'
SuretyGuard = require 'components/surety-guard'


VocabularyControls = React.createClass

  update: -> @forceUpdate()

  componentWillMount: ->
    VocabularyStore.addChangeListener(@update)

  componentWillUnmount: ->
    VocabularyStore.removeChangeListener(@update)

  saveVocabulary: ->
    if VocabularyStore.isNew(@props.id)
      VocabularyActions.create(@props.id, VocabularyStore.get(@props.id))
      VocabularyStore.once 'created', (id) =>
        @props.location.visitVocab(id)
    else
      VocabularyActions.save(@props.id)

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
