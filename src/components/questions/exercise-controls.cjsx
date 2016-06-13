React = require 'react'
BS = require 'react-bootstrap'
cn = require 'classnames'

{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{AsyncButton} = require 'openstax-react-components'
showDialog = require './unsaved-dialog'

Icon = require '../icon'

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
    sectionizerProps:  React.PropTypes.object
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    onShowCardViewClick: React.PropTypes.func.isRequired

  getDefaultProps: ->
    sectionizerProps: {}

  getInitialState: -> {
    hasSaved: false
  }

  getSections: ->
    _.keys @props.exercises.all.grouped

  onFilterClick: (ev) ->
    filter = ev.currentTarget.getAttribute('data-filter')
    if filter is @props.filter then filter = ''
    @props.onFilterChange( filter )

  render: ->
    sections = @getSections()

    selected = @props.selectedSection or _.first(sections)

    <div className="exercise-controls-bar">
      <BS.ButtonGroup className="filters">

        <BS.Button data-filter='all' onClick={@onFilterClick}
          className={if _.isEmpty(@props.filter) then 'all active' else 'all'}
        >
          All
        </BS.Button>

        <BS.Button data-filter='reading' onClick={@onFilterClick}
          className={if @props.filter is 'reading' then 'reading active' else 'reading'}
        >
          Reading
        </BS.Button>

        <BS.Button data-filter='homework' onClick={@onFilterClick}
          className={if @props.filter is 'homework' then 'homework active' else 'homework'}
        >
          Practice
        </BS.Button>
      </BS.ButtonGroup>

      {@props.children}

    </div>



module.exports = QuestionsControls
