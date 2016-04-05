{Testing, expect, sinon, _} = require 'test/helpers'

ExercisePreview = require 'components/exercise/preview'

EXERCISE = require '../../../stubs/exercise/review'
ANSWERS  = EXERCISE.content.questions[0].answers

describe 'Exercise Preview Component', ->

  beforeEach ->
    @props = {
      exercise: EXERCISE
    }

  it 'displays the exercise answers', ->
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      for answer, i in _.pluck(dom.querySelectorAll('.answers-answer .answer .choice'), 'textContent')
        expect(answer).to.equal( ANSWERS[i].content_html )


  it 'renders the feedback', ->
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      for answer, i in _.pluck(dom.querySelectorAll('.answers-answer .answer .feedback'), 'textContent')
        expect(answer).to.equal( ANSWERS[i].feedback_html )

  it 'sets the className when displaying feedback', ->
    _.extend(@props, displayFeedback: true)
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      expect(dom.classList.contains('is-displaying-feedback')).to.be.true

  it 'can hide the answers', ->
    _.extend(@props, hideAnswers: true)
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.answers-table').textContent).to.be.empty
      expect(dom.classList.contains('answers-hidden')).to.be.true
