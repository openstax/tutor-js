{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

{Answer} = require 'components/question/answer'
STEP = require '../exercise/step-data'

ANSWER =
  "id": "40641",
  "content_html": "solid"
  "feedback_html": "feedback yo"

describe 'Answer Component', ->
  propsWithFeedback = props = null

  beforeEach ->
    props =
      answer: ANSWER
      type: 'student'

    propsWithFeedback =
      answer: ANSWER
      type: 'student'
      show_all_feedback: true

  it 'renders answer', ->
    Testing.renderComponent( Answer, props: props ).then ({dom}) ->
      answers = _.pluck dom.querySelectorAll('.answer-content'), 'textContent'
      expect(answers).to.deep.equal(['solid'])

  it 'renders answer feedback based on props', ->

    Testing.renderComponent( Answer, props: propsWithFeedback ).then ({dom}) ->
      answers = _.pluck dom.querySelectorAll('.question-feedback-content'), 'textContent'
      expect(answers).to.deep.equal(['feedback yo'])
