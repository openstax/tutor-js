{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

{ExerciseStep} = require 'exercise'
Collection = require 'exercise/collection'
step = require '../../api/steps/4573/GET'


setFreeResponse = (dom, answer) ->
  ta = dom.querySelector('textarea')
  ta.value = answer
  ReactTestUtils.Simulate.change(ta, target: {value: ta.value})

# utility fn to set the free response
saveFreeResponse = (dom, answer) ->
  setFreeResponse(dom, answer)
  Testing.actions.click(dom.querySelector('button.continue'))

describe 'Exercise Step', ->

  beforeEach ->
    @props =
      id: '4573'
      item: _.clone(step)

    Collection.quickLoad(@props.id, @props.item)


  it 'renders given exercise', ->
    Testing.renderComponent( ExerciseStep, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.openstax-exercise')).not.to.be.null

  it 'caches free response', ->
    Testing.renderComponent( ExerciseStep, props: @props ).then ({dom}) ->
      setFreeResponse(dom, 'My Partial Answer')
      expect(dom.querySelector('textarea').value).equal('My Partial Answer')
      expect(dom.querySelector('.free-response')).to.be.null

      setFreeResponse(dom, 'My Second Partial Answer')
      expect(dom.querySelector('textarea').value).equal('My Second Partial Answer')
      expect(dom.querySelector('.free-response')).to.be.null


  it 'saves free response', ->
    Testing.renderComponent( ExerciseStep, props: @props ).then ({dom}) ->
      saveFreeResponse(dom, 'My Answer')
      expect(dom.querySelector('textarea')).to.be.null
      expect(dom.querySelector('.free-response').innerText).equal('My Answer')

  it 'renders answer choices after free response', ->
    Testing.renderComponent( ExerciseStep, props: @props ).then ({dom}) ->
      saveFreeResponse(dom, 'My Second Answer')
      expect(dom.querySelector('.free-response').textContent).equal('My Second Answer')
      answers = _.pluck dom.querySelectorAll('.answer-content'), 'textContent'
      expect(answers).to.deep.equal(
        _.pluck(step.content.questions[0].answers, 'content_html')
      )

  it 'sets answer id after selection', ->
    Testing.renderComponent( ExerciseStep, props: @props ).then ({dom}) =>
      saveFreeResponse(dom, 'My Second Answer')
      answer = dom.querySelectorAll('.answers-answer')[0]
      input = answer.querySelector('input')
      ReactTestUtils.Simulate.change(input, target:{checked: true})
      Testing.actions.click(input)
      expect(@props.item.answer_id).equal(step.content.questions[0].answers[0].id)
