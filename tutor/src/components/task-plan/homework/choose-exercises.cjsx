React      = require 'react'
_          = require 'underscore'
BS         = require 'react-bootstrap'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

AddExercises    = require './add-exercises'
ReviewExercises = require './review-exercises'
SelectTopics    = require '../select-topics'
{ScrollToMixin} = require 'shared'

{ExerciseActions} = require '../../../flux/exercise'

ChooseExercises = React.createClass

  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
    planId:      React.PropTypes.string.isRequired
    courseId:    React.PropTypes.string.isRequired
    hide:        React.PropTypes.func.isRequired
    cancel:      React.PropTypes.func.isRequired
    canEdit:     React.PropTypes.bool

  mixins: [ScrollToMixin]

  getInitialState: ->
    showProblems: false

  selectProblems: ->

    ExerciseActions.loadForCourse(
      @props.courseId, TaskPlanStore.getTopics(@props.planId), @props.ecosystemId
    )
    @setState(showProblems: true)

  onAddClick: ->
    @setState(showProblems: false)
    @scrollToSelector('.select-topics')

  onSectionChange: ->
    @setState(showProblems: false)

  render: ->
    {courseId, planId, ecosystemId, hide, cancel} = @props

    selected = TaskPlanStore.getTopics(planId)

    primaryBtn =
      <BS.Button
        className={'-show-problems'}
        bsStyle='primary'
        disabled={_.isEmpty(selected)}
        onClick={@selectProblems}
        key='hello'
      >Show Problems</BS.Button>

    <div className='homework-plan-exercise-select-topics'>

      <SelectTopics
        primary={primaryBtn}
        onSectionChange={@onSectionChange}
        header={<span key='hd'>Add Questions</span>}
        type="homework"
        courseId={courseId}
        ecosystemId={ecosystemId}
        planId={planId}
        selected={selected}
        cancel={cancel}
        hide={hide} />

      {<AddExercises
        hide={hide}
        cancel={cancel}
        canEdit={true}
        canAdd={true}
        onAddClick={@onAddClick}
        courseId={courseId}
        planId={planId}
        sectionIds={selected}
      /> if selected.length and @state.showProblems}


    </div>

module.exports = ChooseExercises
