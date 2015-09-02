{Testing, expect, _} = require '../helpers/component-testing'

{TimeActions, TimeStore} = require '../../../src/flux/time'

Cell = require '../../../src/components/scores/reading-cell'

describe 'Scores Report Reading Cell', ->

  beforeEach ->
    @props =
      courseId: '1'
      student:
        name: 'Molly Bloom'
        role: 'student'
      task:
        status:          'in_progress'
        due_at:          '2015-10-14T12:00:00.000Z'
        last_worked_at:  '2015-10-13T12:00:00.000Z'
        type:            'reading'

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

  it 'renders with late icon', ->
    @props.task.last_worked_at = '2015-10-15T12:00:00.000Z'
    Testing.renderComponent( Cell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('i.late')).not.to.be.null
