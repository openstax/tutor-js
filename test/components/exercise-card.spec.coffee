{Testing, expect, sinon, _, ReactTestUtils} = require './helpers/component-testing'

ExerciseCard = require '../../src/components/exercise-card'

EXERCISE = (require '../../api/exercises.json').items[0]
ANSWERS  = _.sortBy(EXERCISE.content.questions[0].answers, 'id')

describe 'Exercise Card Component', ->

  beforeEach ->
    @props = {
      exercise: EXERCISE
    }

  it 'displays the exercise questions sorted by id', ->
    Testing.renderComponent( ExerciseCard, props: @props ).then ({dom}) ->
      for answer, i in _.pluck(dom.querySelectorAll('.answers-answer .answer .choice'), 'textContent')
        expect(answer).to.equal( ANSWERS[i].content_html )

  it 'renders the feedback', ->
    Testing.renderComponent( ExerciseCard, props: @props ).then ({dom}) ->
      for answer, i in _.pluck(dom.querySelectorAll('.answers-answer .answer .feedback'), 'textContent')
        expect(answer).to.equal( ANSWERS[i].feedback_html )

  it 'sets the className when displaying feedback', ->
    _.extend(@props, displayFeedback: true)
    Testing.renderComponent( ExerciseCard, props: @props ).then ({dom}) ->
      expect(dom.classList.contains('is-displaying-feedback')).to.be.true
