React = require 'react'
_     = require 'underscore'

{TaskPlanStore}        = require '../../../flux/task-plan'
{ExerciseStore}        = require '../../../flux/exercise'

{ArbitraryHtmlAndMath} = require 'shared'

LoadingExercises       = require './loading-exercises-mixin'
ChapterSection         = require '../chapter-section'

{ default: TourRegion } = require '../../tours/region'

ExerciseTable = React.createClass

  mixins: [LoadingExercises]

  propTypes:
    planId: React.PropTypes.string.isRequired

  renderExerciseRow: (exerciseId, index, hasTeks) ->
    {section, lo, tagString} = ExerciseStore.getTagStrings(exerciseId)
    content = document.createElement("span")
    content.innerHTML = ExerciseStore.getContent(exerciseId)
    _.each(content.getElementsByTagName('img'), (img) ->
      if img.nextSibling then img.remove() else img.parentElement?.remove()
    )

    content = content.innerHTML

    if (hasTeks)
      teksString = ExerciseStore.getTeksString(exerciseId)
      unless teksString
        teksString = "-"

      teks = <td>{teksString}</td>

    <tr key="exercise-row-#{index}">
      <td className="exercise-number">{index + 1}</td>
      <td>
        <ChapterSection section={section}/>
      </td>
      <td>
        <ArbitraryHtmlAndMath block={false} html={content} />
      </td>
      <td className="ellipses">{lo}</td>
      {teks}
      <td className="ellipses">{tagString.join(' / ')}</td>
    </tr>

  renderTutorRow: (index, hasTeks) ->
    if hasTeks
      teksColumn = <td>-</td>

    numSelected = TaskPlanStore.getExercises(@props.planId).length
    number = index + numSelected + 1

    <tr key="exercise-row-tutor-#{index}">
      <td className="exercise-number">{number}</td>
      <td>-</td>
      <td>Tutor Selection</td>
      {teksColumn}
      <td>-</td>
      <td>-</td>
    </tr>


  render: ->
    return @renderLoading() if @exercisesAreLoading()

    tutorSelection = TaskPlanStore.getTutorSelections(@props.planId)
    exerciseIds = TaskPlanStore.getExercises(@props.planId)

    hasTeks = _.every(exerciseIds, (id) -> ExerciseStore.getTeksString(id))

    if (hasTeks)
      teksHead = <td>TEKS</td>

    <TourRegion
      tag="table"
      delay=4000
      className="exercise-table"
      id={"add-homework-review-sections"}
      courseId={@props.courseId}
    >
      <thead>
        <tr>
          <td></td>
          <td></td>
          <td>Problem Question</td>
          <td>Learning Objective</td>
          {teksHead}
          <td>Details</td>
        </tr>
      </thead>
      <tbody>
        {_.map(exerciseIds, (exerciseId, index) => @renderExerciseRow(exerciseId, index, hasTeks))}
        {_.times(tutorSelection, (index) => @renderTutorRow(index, hasTeks))}
      </tbody>
    </TourRegion>


module.exports = ExerciseTable
