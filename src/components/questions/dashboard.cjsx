React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{ExerciseActions} = require '../../flux/exercise'
{TocStore, TocActions} = require '../../flux/toc'

SectionsChooser = require './sections-chooser'
ExercisesDisplay = require './exercises-display'

Icon = require '../icon'
LoadingDisplay = require './loading-display'


QuestionsDashboard = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired

  getInitialState: ->
    focusedExercise: false

  onShowDetailsViewClick: (ev, exercise) ->
    @setState(showingDetails: true)
  onShowCardViewClick: ->
    @setState(showingDetails: false)

  onSelectionsChange: (sectionIds) ->
    @setState({sectionIds})

  render: ->
    classes = classnames( 'questions-dashboard', { 'is-showing-details': @state.focusedExercise } )

    <div className={classes} >
      <LoadingDisplay chapterIds={@state.chapterIds} sectionIds={@state.sectionIds} />

      <SectionsChooser {...@props}
        onSelectionsChange={@onSelectionsChange} />

      <ExercisesDisplay
        {...@props}
        showingDetails={@state.showingDetails}
        onShowCardViewClick={@onShowCardViewClick}
        onShowDetailsViewClick={@onShowDetailsViewClick}
        sectionIds={@state.sectionIds} />

    </div>

module.exports = QuestionsDashboard
