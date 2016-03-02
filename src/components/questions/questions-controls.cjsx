React = require 'react'
BS = require 'react-bootstrap'
cn = require 'classnames'

{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{PinnedHeader} = require 'openstax-react-components'
Icon = require '../icon'
Sectionizer = require './sectionizer'

QuestionsControls = React.createClass

  propTypes:
    exercises: React.PropTypes.shape(
      all: React.PropTypes.object
      homework: React.PropTypes.object
      reading: React.PropTypes.object
    ).isRequired
    selectedExercises: React.PropTypes.array
    filter: React.PropTypes.string
    onFilterChange: React.PropTypes.func.isRequired

  getInitialState: -> {}

  getSections: ->
    (cs.split(',').join('.') for cs, sections of @props.exercises.all.grouped)

  onFilterClick: (ev) ->
    filter = ev.currentTarget.getAttribute('data-filter')
    if filter is @props.filter then filter = ''
    @props.onFilterChange( filter )

  resetExclusions: ->
    ExerciseActions.resetUnsavedExclusions()

  renderSaveCancelButtons: ->
    [
        <BS.Button key='save' bsStyle='primary' className="save">Save</BS.Button>
        <BS.Button key='cancel' className="cancel" onClick={@resetExclusions}>Cancel</BS.Button>
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
      <Sectionizer chapter_sections={@getSections()} />
      <div className="save-cancel">
        {@renderSaveCancelButtons() if ExerciseStore.hasUnsavedExclusions()}
      </div>
    </div>



module.exports = QuestionsControls
