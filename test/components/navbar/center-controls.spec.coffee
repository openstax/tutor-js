{Testing, expect, sinon, _} = require '../helpers/component-testing'

CenterControls = require '../../../src/components/navbar/center-controls'
{TaskActions, TaskStore} = require '../../../src/flux/task'

TASK_ID = '4'

VALID_MODEL = require '../../../api/tasks/4.json'

ROUTER_PARAMS =
  id: TASK_ID


describe 'Center Controls', ->
  before ->
    TaskActions.loaded(VALID_MODEL, TASK_ID)

  after ->
    TaskActions.reset()

  it 'renders with task title', ->
    Testing.renderComponent( CenterControls, routerParams: ROUTER_PARAMS ).then ({dom, element}) ->
      {title} = VALID_MODEL

      expect(dom.querySelector('.center-control span').textContent).to.equal(title)