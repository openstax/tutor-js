# Tests for homework specific tasks

# -----------------------------------------------------------------------------------------------------
# TODO: For some reason the StepContent is undefined in the test, and therefore this code doesn't work.
# -----------------------------------------------------------------------------------------------------

{Testing, expect, sinon, _} = require './helpers/component-testing'

{StepContent} = '../../src/components/task-step/step-with-reading-content'

{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'
{CourseActions} = require '../../src/flux/course'

courseId = '1'
course = require '../../api/user/courses/1.json'
interactiveStep = require '../../api/steps/step-id-4-4.json'
interactiveStepId = '4'

describe 'Task Widget, rendering content', ->
  beforeEach ->
    CourseActions.loaded(course, courseId)
    TaskStepActions.loaded(interactiveStep, interactiveStepId)

  it 'should render no frame for interactives', ->
    # render the step and then make sure it doesn't have a frame around it
    props = {
      id: interactiveStepId
      stepType: 'interactive'
    }

    Testing.renderComponent(StepContent, props: props).then ({dom}) ->
      expect(dom.querySelector('.frame-wrapper')).to.be.null

  it 'should render a frame for non-interactives', ->
    # render the step and then make sure it doesn't have a frame around it
    props = {
      id: interactiveStepId
      stepType: 'interactive'
    }

    Testing.renderComponent(StepContent, props: props).then ({dom}) ->
      expect(dom.querySelector('.frame-wrapper')).to.not.be.null
