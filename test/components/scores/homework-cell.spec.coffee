{Testing, expect, _} = require '../helpers/component-testing'

{TimeActions, TimeStore} = require '../../../src/flux/time'

Cell = require '../../../src/components/scores/homework-cell'

describe 'Scores Report Homework Cell', ->

  beforeEach ->
    @props =
      courseId: '1'
      student:
        name: 'Molly Bloom'
        role: 'student'
      task:
        status:          'in_progress'
        type:            'homework'
        exercise_count: 11
        correct_exercise_count: 9

  describe 'before due date', ->
    beforeEach ->
      now = new Date()
      iso_string = 'Fri Jun 11 2015 00:00:00 GMT+0000 (UTC)'
      TimeActions.setFromString(iso_string, now)
      _.extend @props.task,
        due_at:          '2015-10-14T12:00:00.000Z'
        last_worked_at:  '2015-10-13T12:00:00.000Z'

    it 'renders as in progress', ->
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('In progress')
        expect(dom.querySelector('i.late')).to.be.null

    it 'renders as not started', ->
      @props.task.status = 'not_started'
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('Not started')
        expect(dom.querySelector('i.late')).to.be.null

    it 'renders as complete', ->
      @props.task.status = 'completed'
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('Complete')
        expect(dom.querySelector('i.late')).to.be.null

    it 'renders as in progress if status is garbage', ->
      @props.task.status = 'jfdsafa'
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('In progress')
        expect(dom.querySelector('i.late')).to.be.null

  describe 'after due date', ->
    beforeEach ->
      now = new Date()
      iso_string = 'Fri Nov 11 2015 00:00:00 GMT+0000 (UTC)'
      TimeActions.setFromString(iso_string, now)

      _.extend @props.task,
        due_at:          '2015-10-14T12:00:00.000Z'
        last_worked_at:  '2015-10-13T12:00:00.000Z'

    it 'renders as not started, without icon', ->
      @props.task.status = 'not_started'
      @props.task.last_worked_at = '2015-10-15T12:00:00.000Z'
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('Not started')
        expect(dom.querySelector('i.late')).to.be.null

    it 'shows scores when completed', ->
      @props.task.status = 'completed'
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('9/11')
        expect(dom.querySelector('i.late')).to.be.null

    it 'displays late icon when worked late', ->
      @props.task.last_worked_at = '2015-10-15T12:00:00.000Z'
      Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('9/11')
        expect(dom.querySelector('i.late')).to.not.be.null
