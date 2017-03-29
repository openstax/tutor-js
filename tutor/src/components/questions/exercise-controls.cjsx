React = require 'react'
BS = require 'react-bootstrap'
classNames = require 'classnames'

keys    = require 'lodash/keys'
first   = require 'lodash/first'
isEmpty = require 'lodash/isEmpty'

{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{CourseStore} = require '../../flux/course'
{AsyncButton, ScrollToMixin} = require 'shared'
showDialog = require './unsaved-dialog'
{default: TourAnchor} = require '../tours/anchor'

Icon = require '../icon'

QuestionsControls = React.createClass

  mixins: [ScrollToMixin]
  scrollingTargetDOM: -> @props.windowImpl.document
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
    keys @props.exercises.all.grouped

  onFilterClick: (ev) ->
    filter = ev.currentTarget.getAttribute('data-filter')
    if filter is @props.filter then filter = ''
    @props.onFilterChange( filter )

  render: ->
    sections = @getSections()

    selected = @props.selectedSection or first(sections)

    isConceptCoach = CourseStore.isConceptCoach(@props.courseId)
    filters =
      <TourAnchor id="exercise-type-toggle">
        <BS.ButtonGroup className="filters">

          <BS.Button data-filter='reading' onClick={@onFilterClick}
            className={classNames 'reading', 'active': @props.filter is 'reading'}
          >
            Reading
          </BS.Button>

          <BS.Button data-filter='homework' onClick={@onFilterClick}
            className={classNames 'homework', 'active': @props.filter is 'homework'}
          >
            Practice
          </BS.Button>
        </BS.ButtonGroup>
      </TourAnchor>

    <div className="exercise-controls-bar">
      {@props.children}

      <div className="filters-wrapper">
        {filters unless isConceptCoach}
      </div>

      <BS.Button onClick={@scrollToTop}>
        + Select more sections
      </BS.Button>

    </div>



module.exports = QuestionsControls
