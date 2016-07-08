{Testing, expect, _} = require '../helpers/component-testing'

{TimeActions, TimeStore} = require '../../../src/flux/time'

Cell = require '../../../src/components/scores/homework-cell'
PieProgress = require '../../../src/components/scores/pie-progress'

TH = require '../../../src/helpers/task'

describe 'Student Scores Homework Cell', ->

  beforeEach ->
    @props =
      courseId: '1'
      student:
        name: 'Molly Bloom'
        role: 'student'
      task:
        status:          'in_progress'
        type:            'homework'
        exercise_count: 17
        correct_exercise_count: 9
        completed_step_count: 11
        correct_on_time_exercise_count: 3
        completed_exercise_count: 11
        completed_on_time_exercise_count: 11
        completed_accepted_late_exercise_count: 0
        correct_accepted_late_exercise_count: 0

  it 'renders score cell', ->
    completedProps = _.extend({}, @props)
    completedProps.task.completed_on_time_exercise_count = @props.task.exercise_count
    completedProps.task.completed_exercise_count = @props.task.exercise_count

    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      score = '---'
      expect(dom.querySelector('.score a').textContent).to.equal(score)
      expect(dom.querySelector('.late-caret')).to.be.null

    Testing.renderComponent( Cell, props: completedProps ).then ({dom}) =>
      score = ((@props.task.correct_on_time_exercise_count / @props.task.exercise_count) * 100).toFixed(0) + '%'
      expect(dom.querySelector('.score a').textContent).to.equal(score)
      expect(dom.querySelector('.late-caret')).to.be.null

  it 'renders progress cell', ->
    @props.size = 24
    @props.value = 33
    Testing.renderComponent( PieProgress, props: @props ).then ({dom}) ->
      expect(dom.querySelector('g')).to.exist

  it 'renders as not started', ->
    @props.task.completed_exercise_count = 0
    @props.task.completed_on_time_exercise_count = 0
    @props.task.correct_on_time_exercise_count = 0
    expect(TH.getCompletedPercent(@props.task)).to.equal(0)
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.worked .not-started')).to.exist

  it 'displays late caret when worked late', ->
    @props.task.completed_on_time_step_count = 3
    expect(TH.isLate(@props.task)).to.be.true
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.late-caret')).to.exist

  it 'displays accepted caret when accepted', ->
    @props.task.completed_on_time_step_count = 3
    @props.task.is_late_work_accepted = true
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.late-caret.accepted')).to.exist
