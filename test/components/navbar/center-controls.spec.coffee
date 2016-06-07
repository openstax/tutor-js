{Testing, expect, sinon, _} = require '../helpers/component-testing'

CenterControls = require '../../../src/components/navbar/center-controls'
{TaskActions, TaskStore} = require '../../../src/flux/task'
React = require 'react/addons'
moment = require 'moment'
{commonActions} = require '../helpers/utilities'

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

  it 'displays date on hover', ->
    Testing.renderComponent( CenterControls, routerParams: ROUTER_PARAMS ).then ({dom, element}) ->
      iconEl = dom.querySelector('.tutor-icon[type="calendar-check-o"]')
      React.addons.TestUtils.Simulate.mouseOver(iconEl)
      tooltipEl = document.querySelector('div[role="tooltip"]')
      expect(tooltipEl).to.exist
      due = element.reformatTaskDue(VALID_MODEL.due_at)
      expect(tooltipEl.textContent).to.equal(due)

  it 'toggles milestones via path', ->
    Testing.renderComponent( CenterControls, routerParams: ROUTER_PARAMS ).then ({dom, element}) ->
      iconEl = dom.querySelector('.tutor-icon[type="th"]')
      React.addons.TestUtils.Simulate.click(iconEl)
      path = element.context.router.getCurrentPath()
      expect(path).to.equal('viewTaskStepMilestones')
      React.addons.TestUtils.Simulate.click(iconEl)
      path = element.context.router.getCurrentPath()
      expect(path).to.equal('viewTaskStep')
