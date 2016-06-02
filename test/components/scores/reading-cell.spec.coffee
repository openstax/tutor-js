{Testing, expect, _} = require '../helpers/component-testing'

{TimeActions, TimeStore} = require '../../../src/flux/time'

Cell = require '../../../src/components/scores/reading-cell'
PieProgress = require '../../../src/components/scores/pie-progress'

TH = require '../../../src/helpers/task'

describe 'Student Scores Report Reading Cell', ->

  beforeEach ->
    @props =
      courseId: '1'
      student:
        name: 'Molly Bloom'
        role: 'student'
      task:
        status:          'in_progress'
        type:            'reading'
        step_count: 17
        completed_step_count: 11
        completed_on_time_step_count: 11
        completed_accepted_late_step_count: 0

  it 'renders progress cell', ->
    @props.size = 24
    @props.value = 33
    Testing.renderComponent( PieProgress, props: @props ).then ({dom}) ->
      expect(dom.querySelector('g')).to.exist

  it 'renders as not started', ->
    @props.task.completed_step_count = 0
    @props.task.completed_on_time_step_count = 0
    expect(TH.getCompletedPercent(@props.task)).to.equal(0)
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.worked .not-started')).to.exist

  it 'displays late caret when worked late', ->
    @props.task.completed_on_time_step_count = 3
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.late-caret')).to.exist

  it 'displays accepted caret when accepted', ->
    @props.task.completed_on_time_step_count = 3
    @props.task.is_late_work_accepted = true
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.late-caret.accepted')).to.exist
