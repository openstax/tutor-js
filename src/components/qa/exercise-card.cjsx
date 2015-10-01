_ = require 'underscore'
React = require 'react'

{ExerciseCardMixin} = require '../task-plan/homework/exercises'
{ExerciseStore} = require '../../flux/exercise'
String = require '../../helpers/string'

Exercise = React.createClass

  mixins: [ExerciseCardMixin]

  propTypes:
    exercise: React.PropTypes.object.isRequired

  getPanelStyle: ->
    "default"

  renderHeader: ->
    <div className='pools'>
      {for pool in ExerciseStore.poolTypes(@props.exercise)
        <span key={pool} className={pool}>{String.titleize(pool)}</span>}
    </div>


  render: ->
    @renderExercise()


module.exports = Exercise
