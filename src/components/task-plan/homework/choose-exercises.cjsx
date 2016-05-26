React      = require 'react'
_          = require 'underscore'
BS         = require 'react-bootstrap'
classnames = require 'classnames'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{PinnedHeaderFooterCard} = require 'openstax-react-components'

AddExercises    = require './add-exercises'
ReviewExercises = require './review-exercises'
SelectTopics    = require '../select-topics'
ExerciseSummary = require './exercise-summary'


ChooseExercises = React.createClass

  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    selected: React.PropTypes.array.isRequired
    hide: React.PropTypes.func.isRequired
    canEdit: React.PropTypes.bool

  selectProblems: ->
    @setState({
      showProblems: true
    })

  render: ->
    return null unless @props.isVisible

    {courseId, planId, ecosystemId, selected, hide, cancel} = @props

    header = <span>Add Problems</span>
    selected = TaskPlanStore.getTopics(planId)
    shouldShowExercises = @props.selected?.length and @state?.showProblems

    classes = classnames('-show-problems', { disabled: _.isEmpty(selected) })

    primary =
      <BS.Button
        className={classes}
        bsStyle='primary'
        onClick={@selectProblems}>Show Problems
      </BS.Button>

    if shouldShowExercises
      exerciseSummary = <ExerciseSummary
          canReview={true}
          canEdit={@props.canEdit}
          reviewClicked={hide}
          onCancel={cancel}
          planId={planId}/>

      addExercises = <AddExercises
          courseId={courseId}
          planId={planId}
          sectionIds={selected}/>

    <div className='homework-plan-exercise-select-topics'>
      <SelectTopics
        primary={primary}
        header={header}
        courseId={courseId}
        ecosystemId={ecosystemId}
        planId={planId}
        selected={selected}
        cancel={cancel}
        hide={hide} />

      <PinnedHeaderFooterCard
        containerBuffer={50}
        header={exerciseSummary}
        cardType='homework-builder'>
        {addExercises}
      </PinnedHeaderFooterCard>
    </div>

module.exports = ChooseExercises
