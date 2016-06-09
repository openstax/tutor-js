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
  stepIndex: '1'
  courseId: '1'

MILESTONES_ROUTER_PARAMS = _.extend {milestones: true}, ROUTER_PARAMS

PROPS =
  shouldShow: true

describe 'Center Controls', ->
  before ->
    TaskActions.loaded(VALID_MODEL, TASK_ID)

  after ->
    TaskActions.reset()

  it 'renders with task title', ->
    Testing.renderComponent( CenterControls, {routerParams: ROUTER_PARAMS, props: PROPS} ).then ({dom, element}) ->
      {title} = VALID_MODEL
      expect(dom.querySelector('.center-control span').textContent).to.equal(title)

  it 'displays date on hover', ->
    Testing.renderComponent( CenterControls, {routerParams: ROUTER_PARAMS, props: PROPS} ).then ({dom, element}) ->
      iconEl = dom.querySelector('.tutor-icon[type^="calendar-"]')
      React.addons.TestUtils.Simulate.mouseOver(iconEl)
      tooltipEl = document.querySelector('div[role="tooltip"]')
      expect(tooltipEl).to.exist
      due = element.reformatTaskDue(VALID_MODEL.due_at)
      expect(tooltipEl.textContent).to.equal(due)

  it 'renders milestones link when not on milestones path', ->
    Testing.renderComponent( CenterControls, {routerParams: ROUTER_PARAMS, props: PROPS} ).then ({dom, element}) ->
      {to, className} = element.refs.milestonesToggle.props
      expect(to).to.equal('viewTaskStepMilestones')
      expect(className).to.not.contain('active')

  it 'renders close milestones link when on milestones path', ->
    Testing.renderComponent( CenterControls, {routerParams: MILESTONES_ROUTER_PARAMS, props: PROPS} ).then ({dom, element}) ->
      {to, className} = element.refs.milestonesToggle.props
      expect(to).to.equal('viewTaskStep')
      expect(className).to.contain('active')
