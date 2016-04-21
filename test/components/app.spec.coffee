{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

App = require 'components/app'

describe 'Exercises component', ->
  beforeEach ->
    @props =
      data:
        user:
          full_name: 'Bob'

  it 'renders a blank exercise when btn is clicked', ->
    Testing.renderComponent( App, props: @props ).then ({dom}) ->

      expect( dom.querySelector('.exercise-editor') ).not.to.exist
      ReactTestUtils.Simulate.click dom.querySelector('.btn.exercises.blank')
      expect( dom.querySelector('.exercise-editor') ).not.exist
