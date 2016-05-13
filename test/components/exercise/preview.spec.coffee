{Testing, expect, sinon, _, ReactTestUtils} = require 'test/helpers'

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
      expect(dom.querySelector('.answers-table')).to.be.not.ok
      expect(dom.classList.contains('answers-hidden')).to.be.true

  it 'can render question formats', ->
    _.extend(@props, displayFormats: true)
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      formats = dom.querySelector('.formats-listing')
      expect(_.pluck(formats.querySelectorAll('span'), 'textContent')).to.deep.equal([
        'free-response', 'multiple-choice'
      ])

  it 'does not render overlay by default', ->
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.toggle-mask') ).not.to.exist

  it 'calls select callback when overlay is clicked', ->
    onSelect = sinon.spy()
    _.extend(@props, onSelection: onSelect)
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      Testing.actions.click( dom.querySelector('.toggle-mask') )
      expect( dom.querySelector('.toggle-mask .details') ).not.to.exist # does not render since no callback
      expect(onSelect).to.have.been.called

  it 'calls details callback when details pane is clicked', ->
    onSelect = sinon.spy()
    onDetails = sinon.spy()
    _.extend(@props, onSelection: onSelect, onDetailsClick: onDetails)
    Testing.renderComponent( ExercisePreview, props: @props ).then ({dom}) ->
      Testing.actions.click( dom.querySelector('.toggle-mask .details') )
      expect(onDetails).to.have.been.called
      expect(onSelect).not.to.have.been.called
