React      = require 'react'
_          = require 'underscore'
BS         = require 'react-bootstrap'
classnames = require 'classnames'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

AddExercises    = require './add-exercises'
ReviewExercises = require './review-exercises'
SelectTopics    = require '../select-topics'
ScrollTo        = require '../../scroll-to-mixin'

{ExerciseActions} = require '../../../flux/exercise'

ChooseExercises = React.createClass

  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    hide: React.PropTypes.func.isRequired
    canEdit: React.PropTypes.bool

  mixins: [ScrollTo]

  getInitialState: ->
    showProblems: false

  selectProblems: ->
    ExerciseActions.loadForCourse(@props.courseId, TaskPlanStore.getTopics(@props.planId) )
    @setState(showProblems: true)

  onAddClick: ->
    @setState(showProblems: false)
    @scrollToSelector('.select-topics')

  render: ->
    {courseId, planId, ecosystemId, hide, cancel} = @props

    selected = TaskPlanStore.getTopics(planId)

    primaryBtn =
      <BS.Button
        className={classnames('-show-problems', { disabled: _.isEmpty(selected) })}
        bsStyle='primary'
        onClick={@selectProblems}
      >Show Problems</BS.Button>

    <div className='homework-plan-exercise-select-topics'>

      <SelectTopics
        primary={primaryBtn}
        header={<span key='hd'>Add Problems</span>}
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
