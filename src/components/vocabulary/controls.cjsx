React = require 'react'
BS = require 'react-bootstrap'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'

AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'
SuretyGuard = require 'components/surety-guard'


VocabularyControls = React.createClass

  # render nothing for now, maybe a header message or something later?
  render: ->
    {id} = @props

    guardProps =
      onlyPromptIf: @isExerciseDirty
      placement: 'right'
      message: "You will lose all unsaved changes"

    <div className="vocabulary-navbar-controls">
      <BS.ButtonToolbar className="navbar-btn">
        { if id?
          <AsyncButton
            bsStyle='info'
            className='draft'
            onClick={@saveExercise}
            disabled={not ExerciseStore.isSavable(id)}
            isWaiting={ExerciseStore.isSaving(id)}
            waitingText='Saving...'
            isFailed={ExerciseStore.isFailed(id)}
            >
            Save Draft
          </AsyncButton>
        }
      </BS.ButtonToolbar>
    </div>

module.exports = VocabularyControls
