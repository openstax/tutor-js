{Testing, expect, sinon, _} = require 'shared/specs/helpers'

BC = require 'components/breadcrumb'

describe 'Breadcrumb Component', ->

  beforeEach ->
    @props =
      goToStep: sinon.spy()
      step:
        type: 'reading', is_completed: true, correct_answer_id: 1
        task: {title: 'My Assignment'}
      canReview: true
      currentStep: 1
      stepIndex: 2
      crumb:
        type: 'reading'
        labels: ['hot']

  describe 'Title', ->
    it 'indicates current step', ->
      @props.stepIndex = 1
      @props.step.is_completed = false
      Testing.renderComponent( BC, props: @props ).then ({dom}) ->
        expect(dom.getAttribute('title')).equal('Current Step (reading)')
    it 'indicates completed', ->
      @props.step.is_completed = true
      Testing.renderComponent( BC, props: @props ).then ({dom}) ->
        expect(dom.getAttribute('title')).equal('Step Completed (reading). Click to review')
    it 'shows end', ->
      @props.crumb.type = 'end'
      Testing.renderComponent( BC, props: @props ).then ({dom}) ->
        expect(dom.getAttribute('title')).equal('My Assignment Completion')


  describe 'Status', ->
    it 'can be correct', ->
      @props.canReview = true
      @props.step.is_correct = true
      Testing.renderComponent( BC, props: @props ).then ({dom}) ->
        expect(dom.classList.contains('status-correct')).to.be.true
        expect(dom.querySelector('i.icon-correct')).not.to.be.null
    it 'can be incorrect', ->
      @props.canReview = true
      @props.step.answer_id = 11
      Testing.renderComponent( BC, props: @props ).then ({dom}) ->
        expect(dom.classList.contains('status-incorrect')).to.be.true
        expect(dom.querySelector('i.icon-incorrect')).not.to.be.null

    it 'passes on data-label props', ->
      @props['data-label'] = 'This is a Label'
      Testing.renderComponent( BC, props: @props ).then ({dom}) =>
        expect(dom.getAttribute('data-label')).to.equal(@props['data-label'])

  it 'calls onClick handler', ->
    Testing.renderComponent( BC, props: @props ).then ({dom}) =>
      Testing.actions.click(dom)
      expect(@props.goToStep).to.have.been.calledWith(2)
