{Testing, expect, sinon, _} = require '../helpers/component-testing'

Bar = require '../../../src/components/learning-guide/progress-bar'

describe 'Learning Guide Progress Bar', ->

  beforeEach ->
    @props = {
      onPractice: sinon.spy()
      sampleSizeThreshold: 10
      section: { clue: { value: 0.82, sample_size: 2, sample_size_interpretation: 'high', magic: true } }
    }

  it 'calls practice callback', ->
    Testing.renderComponent( Bar, props: @props ).then ({dom}) =>
      Testing.actions.click(dom)
      expect(@props.onPractice).to.have.been.calledWith(@props.section)

  it 'renders the progress bar with correct level', ->
    Testing.renderComponent( Bar, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.progress-bar').style.width).to.equal('82%')

  describe 'when sample_size_interpretation is below', ->

    it 'does not render the bar', ->
      @props.section.clue.sample_size_interpretation = 'below'
      Testing.renderComponent( Bar, props: @props).then ({dom}) ->
        expect(dom.querySelector('.progress-bar')).to.be.null

    describe 'when threshold is met', ->

      it 'renders if threshold is exceeded', ->
        @props.section.clue.sample_size_interpretation = 'below'
        @props.section.clue.sample_size = 2
        @props.sampleSizeThreshold = 1 # less than the clue sample_size of 2
        Testing.renderComponent( Bar, props: @props).then ({dom}) =>
          expect(dom.querySelector('.progress-bar')).not.to.be.null
          Testing.actions.click(dom)
          expect(@props.onPractice).to.have.been.calledWith(@props.section)

      it 'renders if sample threshold is equal', ->
        @props.section.clue.sample_size_interpretation = 'below'
        # both are equal
        @props.sampleSizeThreshold = @props.section.clue.sample_size = 10
        Testing.renderComponent( Bar, props: @props).then ({dom}) =>
          expect(dom.querySelector('.progress-bar')).not.to.be.null
          Testing.actions.click(dom)
          expect(@props.onPractice).to.have.been.calledWith(@props.section)
