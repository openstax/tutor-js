{Testing, expect, _} = require '../helpers/component-testing'

{LateWorkPopover} = require '../../../src/components/scores/late-work'
{ScoresStore, ScoresActions} = require '../../../src/flux/scores'

describe 'Student Scores Latework Popover', ->

  beforeEach ->
    sinon.stub(ScoresActions, 'acceptLate').returns(null)
    @props =
      hide: sinon.spy()
      task:
        "is_included_in_averages": true,
        "is_late_work_accepted": false,
        "last_worked_at": "2016-05-30T03:33:58.143Z",
        "due_at": "2016-05-30T12:00:00.000Z",
        "recovered_exercise_count": 0,
        "score": 0.3333333333333333,
        "correct_on_time_exercise_count": 1,
        "correct_exercise_count": 1,
        "completed_on_time_exercise_count": 2,
        "completed_exercise_count": 3,
        "exercise_count": 3,
        "completed_on_time_step_count": 3,
        "completed_step_count": 2,
        "step_count": 3,
        "status": "in_progress",
        "id": 1,
        "type": "homework"

  afterEach ->
    ScoresActions.acceptLate.restore()

  it "displays title", ->
    for type, title in {
      homework: '1 questions worked after the due date'
      reading:  'Reading progress after the due date'
    }
      @props.task.type = type
      Testing.renderComponent( LateWorkPopover, props: @props ).then ({dom}) ->
        expect(dom.querySelector('.popover-title').textContent).to.equal(title)

  it "displays a summaries", ->
    for type, title in {
      homework: 'homework on 5/29'
      reading:  'reading on 5/29'
    }
      @props.task.type = type
      Testing.renderComponent( LateWorkPopover, props: @props ).then ({dom}) ->
        expect(dom.querySelector('.popover-title').textContent).to.equal(title)

  it 'accepts task on late button click and hides itself', ->
    Testing.renderComponent( LateWorkPopover, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.late-button'))
      expect( ScoresActions.acceptLate ).to.have.been.calledWith(@props.task.id)
      expect(@props.hide).to.have.been.called

  it 'displays re-approve messages for addtional work', ->
    @props.task.is_late_work_accepted = true
    @props.task.completed_exercise_count = 7
    @props.task.completed_on_time_step_count = 0
    @props.task.completed_accepted_late_exercise_count = 2
    @props.task.completed_accepted_late_step_count = 2
    @props.task.completed_step_count = 7
    Testing.renderComponent( LateWorkPopover, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.body').textContent).to.include(
        "This student worked 3 questions\nafter you accepted a late score"
      )
      expect(dom.querySelector('.popover-title').textContent).to.equal('Additional late work')
