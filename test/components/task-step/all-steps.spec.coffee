{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

{ExternalUrl} = require '../../../src/components/task-step/all-steps'
{TaskActions, TaskStore} = require '../../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'

EXT_TASK_ID = '8'

EXT_TASK = require("../../../api/tasks/8.json")

describe 'All Steps', ->

  describe 'External Tasks', ->

    beforeEach ->
      TaskStepActions.reset()
      TaskActions.loaded(EXT_TASK, EXT_TASK_ID)
      @props = {
        taskId: EXT_TASK_ID, title: 'go to github',
        redirectToUrl: sinon.spy(), onStepCompleted: sinon.spy()
      }

    it 'renders', ->
      Testing.renderComponent( ExternalUrl, props: @props ).then ({dom}) ->
        expect(dom.querySelector('a').textContent).to.equal('go to github')
        expect(dom.querySelector('.has-html').innerHTML).to
          .include("<p><strong>Jump off balcony</strong>, <em>onto stranger\'s head</em>")

    it 'redirects and marks as complete', ->
      Testing.renderComponent( ExternalUrl, props: @props ).then ({dom}) =>
        Testing.actions.click(dom.querySelector('a'))
        expect(@props.redirectToUrl).to.have.been.calledWith('http://github.com')
        expect(@props.onStepCompleted).to.have.been.called
