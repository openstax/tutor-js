{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

{ExternalTask} = require '../../../src/components/task/external'
{TaskActions, TaskStore} = require '../../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'

TASK = require '../../../api/tasks/8.json'

describe 'External Task Component', ->

  beforeEach ->
    TaskStepActions.reset()
    TaskActions.loaded(TASK, '8')
    @props = { taskId: '8', redirectToUrl: sinon.spy() }

  it 'renders', ->
    Testing.renderComponent( ExternalTask, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.equal('Redirecting to http://github.com')

  it 'redirects', ->
    Testing.renderComponent( ExternalTask, props: @props ).then ({dom}) =>
      expect(@props.redirectToUrl).to.have.been.calledWith('http://github.com')

  it 'marks as complete', ->
    expect(TaskStepStore.get('step-id-8-1').is_completed).to.be.false
    Testing.renderComponent( ExternalTask, props: @props ).then ({dom}) ->
      expect(TaskStepStore.get('step-id-8-1').is_completed).to.be.true
