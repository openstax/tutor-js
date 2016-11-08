{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'
{ExerciseStep} = require 'exercise'
Collection = require 'exercise/collection'
step = require '../../api/steps/4573/GET'

props =
  id: '4573'
  item: step
  status: 'loaded'

setFreeResponse = (dom, answer) ->
  ta = dom.querySelector('textarea')
  ta.value = answer
  ReactTestUtils.Simulate.change(ta, target: {value: ta.value})

# utility fn to set the free response
saveFreeResponse = (dom, element, answer) ->
  setFreeResponse(dom, answer)
  Testing.actions.click(dom.querySelector('button.continue'))
  element.forceUpdate()

saveAnswerChoice = (dom, element, answerIndex = 0) ->
  input = dom.querySelectorAll('input')[answerIndex]
  ReactTestUtils.Simulate.change(input, target:{checked: true})
  Testing.actions.click(input)

ensureExerciseLoaded = ->
  Collection.channel.emit("load.#{props.id}", {status: 'loaded', data: step})

describe 'Exercise Step', ->

  updatedStep = null

  beforeEach ->
    updatedStep = _.clone(props.item)
    Collection.quickLoad(props.id, updatedStep)

  afterEach ->
    updatedStep = null

  it 'renders given exercise', ->
    Testing.renderComponent( ExerciseStep, {props} ).then ({dom}) ->
      ensureExerciseLoaded()

      expect(dom.querySelector('.openstax-exercise')).not.to.be.null

  it 'caches free response', ->
    Testing.renderComponent( ExerciseStep, {props} ).then ({dom}) ->
      ensureExerciseLoaded()

      setFreeResponse(dom, 'My Partial Answer')
      expect(dom.querySelector('textarea').value).equal('My Partial Answer')
      expect(dom.querySelector('.free-response')).to.be.null

      setFreeResponse(dom, 'My Second Partial Answer')
      expect(dom.querySelector('textarea').value).equal('My Second Partial Answer')
      expect(dom.querySelector('.free-response')).to.be.null


  it 'saves free response', ->
    Testing.renderComponent( ExerciseStep, {props} ).then ({element, dom}) ->
      ensureExerciseLoaded()

      saveFreeResponse(dom, element, 'My Answer')

      expect(dom.querySelector('textarea')).to.be.null
      expect(dom.querySelector('.free-response').textContent).equal('My Answer')

  it 'renders answer choices after free response', ->
    Testing.renderComponent( ExerciseStep, {props} ).then ({element, dom}) ->
      ensureExerciseLoaded()

      saveFreeResponse(dom, element, 'My Second Answer')

      expect(dom.querySelector('.free-response').textContent).equal('My Second Answer')
      answers = _.pluck dom.querySelectorAll('.answer-content'), 'textContent'
      expect(answers).to.deep.equal(
        _.pluck(step.content.questions[0].answers, 'content_html')
      )

  it 'sets answer id after selection', ->
    Testing.renderComponent( ExerciseStep, {props} ).then ({element, dom}) ->
      ensureExerciseLoaded()

      saveFreeResponse(dom, element, 'My Second Answer')

      answer = dom.querySelector('.answers-answer .answer-content')
      saveAnswerChoice(dom, element)

      selectedAnswer = _.find(Collection.get(props.id).content.questions[0].answers, id: updatedStep.answer_id)
      expect(selectedAnswer.content_html).equal(answer.textContent)
