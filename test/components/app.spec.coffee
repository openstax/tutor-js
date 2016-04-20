{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'


App = require 'components/app'



describe 'Exercises component', ->
  beforeEach ->
    @props = {}

  it 'renders a blank exercise when btn is clicked', ->
    Testing.renderComponent( App, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.exercise') ).not.to.exist
      ReactTestUtils.Simulate.click dom.querySelector('.btn.blank')
      expect( dom.querySelector('.exercise') ).not.exist


  it 'does not enable the save draft until savable', (done) ->
    Testing.renderComponent( App, props: @props ).then ({dom}) ->
      ReactTestUtils.Simulate.click dom.querySelector('.btn.blank')
      draftBtn = dom.querySelector('.btn.draft')
      expect( draftBtn.hasAttribute('disabled') ).to.be.true
      for input in dom.querySelectorAll('.question textarea')
        ReactTestUtils.Simulate.change(input,
          target: {value: 'Something, something, something'})
      _.defer ->
        expect(draftBtn.hasAttribute('disabled')).to.be.false
        done()
