{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{TaskReview} = require 'task/review'
Collection = require 'task/collection'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'

describe 'TaskReview Component', ->

  beforeEach ->
    @props =
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
      goToStep: sinon.spy()
    @props.taskId = "#{@props.collectionUUID}/#{@props.moduleUUID}"
    @task = _.extend({}, TASK, @props)
    Collection.load(@props.taskId, @task)

  it 'renders a blank message when no steps are complete', ->
    Testing.renderComponent(TaskReview, props: @props).then ({dom}) ->
      expect(dom.querySelector('h3').textContent).equal('Exercise to see Review')

  it 'renders completed steps', ->
    task = _.clone(@task)
    task.steps = _.map @task.steps, (step) -> _.extend({}, step, is_completed: true)
    Collection.load(@props.taskId, task)

    Testing.renderComponent(TaskReview, props: @props).then ({dom}) =>
      questions = _.map @task.steps, (step) -> step.content.questions[0].stem_html
      expect( _.pluck(dom.querySelectorAll('.openstax-question .question-stem'), 'textContent') )
        .to.deep.equal(questions)
