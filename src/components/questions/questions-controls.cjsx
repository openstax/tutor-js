React = require 'react'
BS = require 'react-bootstrap'
cn = require 'classnames'

{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{AsyncButton} = require 'openstax-react-components'
showDialog = require './unsaved-dialog'

Icon = require '../icon'
ScrollSpy = require '../scroll-spy'
Sectionizer = require './sectionizer'

QuestionsControls = React.createClass

  propTypes:
    exercises: React.PropTypes.shape(
      all: React.PropTypes.object
      homework: React.PropTypes.object
      reading: React.PropTypes.object
    ).isRequired
    courseId: React.PropTypes.string.isRequired
    selectedExercises: React.PropTypes.array
    filter: React.PropTypes.string
    onFilterChange: React.PropTypes.func.isRequired

  getInitialState: -> {
    hasSaved: false
  }

  getSections: ->
    _.keys @props.exercises.all.grouped

  onFilterClick: (ev) ->
    filter = ev.currentTarget.getAttribute('data-filter')
    if filter is @props.filter then filter = ''
    @props.onFilterChange( filter )

  saveExclusions: ->
    @setState(hasSaved: true)
    ExerciseActions.saveExclusions(@props.courseId)

  resetExclusions: ->
    return unless ExerciseStore.hasUnsavedExclusions()

    showDialog('Are you sure you want to cancel?').then ->
      ExerciseActions.resetUnsavedExclusions()

  renderSaveCancelButtons: ->
    return null unless ExerciseStore.hasUnsavedExclusions() or @state.hasSaved
    saveButtonText = if ExerciseStore.hasUnsavedExclusions() then 'Save' else 'Saved'
    disabled = not ExerciseStore.hasUnsavedExclusions()
    [
        <AsyncButton key='save' bsStyle='primary' className="save"
          onClick={@saveExclusions}
          disabled={disabled}
          waitingText='Saving...'
          isWaiting={ExerciseStore.isSavingExclusions()}
        >{saveButtonText}</AsyncButton>
        <BS.Button key='cancel' className="cancel"
          disabled={disabled}
          onClick={@resetExclusions}
        >Cancel</BS.Button>
    ]

  render: ->
    sections = @getSections()

    selected = @props.selectedSection or _.first(sections)
    <div className="questions-controls">
      <BS.ButtonGroup key='filters'>
        <BS.Button data-filter='reading' onClick={@onFilterClick}
          className={if @props.filter is 'reading' then 'reading active' else 'reading'}
        >
          Reading <span className="count">({@props.exercises.reading.count})</span>
        </BS.Button>
        <BS.Button data-filter='homework' onClick={@onFilterClick}
          className={if @props.filter is 'homework' then 'homework active' else 'homework'}
        >
          Practice <span className="count">({@props.exercises.homework.count})</span>
        </BS.Button>
      </BS.ButtonGroup>
      <ScrollSpy dataSelector='data-section' >
        <Sectionizer onScreenElements={[]} chapter_sections={@getSections()} />
      </ScrollSpy>
      <div className="save-cancel">
        {@renderSaveCancelButtons()}
      </div>
    </div>



module.exports = QuestionsControls
