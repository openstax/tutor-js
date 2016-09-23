{Testing, expect, sinon, _} = require 'shared/test/helpers'
{UiSettings} = require 'shared'

{Task} = require 'task'
Collection = require 'task/collection'
{channel} = require 'navigation'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'

describe 'Task Component', ->

  beforeEach ->
    UiSettings.initialize(
      'two-step-info-concept_coach':
        taskId: 'test'
        stepId: 'test'
    )
    @props =
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
      goToStep: sinon.spy()
    @props.taskId = "#{@props.collectionUUID}/#{@props.moduleUUID}"
    @task = _.extend({}, TASK, @props)
    Collection.load(@props.taskId, @task)

  afterEach ->
    UiSettings._reset()

  it 'renders the first step task', ->
    _.each @task.steps, (step) -> step.is_completed = false
    Collection.load(@props.taskId, @task)
    Testing.renderComponent(Task, props: @props).then ({dom}) =>
      # console.log dom
      # console.log JSON.stringify(@task)
      question = dom.querySelector('.openstax-exercise .question-stem').textContent
      expect(question).equal(@task.steps[0].content.questions[0].stem_html)

  # TODO: make an update to shared testing component to take in context as an option
  xit 'renders different step when breadcrumb is clicked', ->
    Testing.renderComponent(Task, props: @props, context: navigator: channel).then ({element}) =>
      crumbs = element.getDOMNode().querySelectorAll('.openstax-breadcrumbs-step')
      Testing.actions.click crumbs[1]
      question = element.getDOMNode().querySelector('.openstax-exercise .question-stem').textContent
      expect(question).to.equal(@task.steps[1].content.questions[0].stem_html)
