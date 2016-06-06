React      = require 'react'
_          = require 'underscore'
BS         = require 'react-bootstrap'
classnames = require 'classnames'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

AddExercises    = require './add-exercises'
ReviewExercises = require './review-exercises'
SelectTopics    = require '../select-topics'

ChooseExercises = React.createClass

  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    selected: React.PropTypes.array.isRequired
    hide: React.PropTypes.func.isRequired
    canEdit: React.PropTypes.bool

  getInitialState: ->
    showProblems: false

  selectProblems: ->
    @setState(showProblems: true)

  render: ->
    {courseId, planId, ecosystemId, selected, hide, cancel} = @props

    selected = TaskPlanStore.getTopics(planId)
    classes  = classnames('-show-problems', { disabled: _.isEmpty(selected) })

    primaryBtn =
      <BS.Button
        key='pb'
        className={classes}
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
        courseId={courseId}
        planId={planId}
        sectionIds={selected}
      /> if selected.length and @state.showProblems}


    </div>

module.exports = ChooseExercises
