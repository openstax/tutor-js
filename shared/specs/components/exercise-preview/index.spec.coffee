{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'
cloneDeep = require 'lodash/cloneDeep'
ExercisePreview = require '../../../src/components/exercise-preview'

EXERCISE = require '../../../api/exercise-preview/data.json'
ANSWERS  = EXERCISE.content.questions[0].answers

describe 'Exercise Preview Component', ->
  props = null

  beforeEach ->
    props = {
      exercise: cloneDeep(EXERCISE)
    }

  it 'displays the exercise answers', ->
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      for answer, i in _.pluck(dom.querySelectorAll('.answers-answer .answer .choice'), 'textContent')
        expect(answer).to.equal( ANSWERS[i].content_html )


  it 'renders the feedback', ->
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      for answer, i in _.pluck(dom.querySelectorAll('.answers-answer .answer .feedback'), 'textContent')
        expect(answer).to.equal( ANSWERS[i].feedback_html )

  it 'sets the className when displaying feedback', ->
    _.extend(props, displayFeedback: true)
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      expect(dom.classList.contains('is-displaying-feedback')).to.be.true

  it 'can hide the answers', ->
    _.extend(props, hideAnswers: true)
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      expect(dom.querySelector('.answers-table')).to.be.not.ok
      expect(dom.classList.contains('answers-hidden')).to.be.true

  it 'can render question formats', ->
    _.extend(props, displayFormats: true)
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      formats = dom.querySelector('.formats-listing')
      expect(_.pluck(formats.querySelectorAll('span'), 'textContent')).to.deep.equal([
        'free-response', 'multiple-choice'
      ])

  it 'does not render overlay by default', ->
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      expect( dom.querySelector('.controls-overlay') ).not.to.exist

  it 'callbacks are called when overlay and actions are clicked', ->
    onSelect = sinon.spy()
    actions =
      include:
        message: 'ReInclude question'
        handler: sinon.spy()

    _.extend(props, {overlayActions: actions, onOverlayClick: onSelect})
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      Testing.actions.click( dom.querySelector('.controls-overlay') )
      expect(onSelect).to.have.been.called
      expect(actions.include.handler).not.to.have.been.called
      action = dom.querySelector('.controls-overlay .action.include')
      expect(action).to.exist
      Testing.actions.click(action)
      expect(actions.include.handler).to.have.been.called
      expect(onSelect.callCount).to.equal(1)

  it 'renders context if given', ->
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      expect(dom.querySelector('div.context')).to.exist

  it 'hides context if missing', ->
    _.extend(props.exercise, context: '')
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      expect(dom.querySelector('div.context')).not.to.exist

  it 'renders answer choices', ->
    Testing.renderComponent( ExercisePreview, props: props ).then ({dom}) ->
      answers = _.pluck dom.querySelectorAll('.openstax-answer .answer-label'), 'textContent'
      expect(answers).to.deep.equal([
        "aa sequence of DNA", "ba sequence of rRNA",
        "ca sequence of mRNA.", "da sequence of tRNA.",
        "aYES", "bNO"
      ])
