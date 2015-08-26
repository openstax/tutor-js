{Testing, expect, _} = require './helpers/component-testing'

Name = require '../../src/components/name'

describe 'Name Component', ->

  beforeEach ->
    @props =
      name: 'Prince Humperdinck'
      first_name: 'Vincent'
      last_name: 'Adultman'

  it 'renders using name if present and ignores first and last name', ->
    Testing.renderComponent( Name, props: @props ).then ({dom}) ->
      expect(dom.innerText).to.equal('Prince Humperdinck')

  describe 'when missing name', ->
    it 'doesn\'t use a undefined name', ->
      delete @props.name
      Testing.renderComponent( Name, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('Vincent Adultman')

    it 'doesn\'t use a null name', ->
      @props.name = null
      Testing.renderComponent( Name, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('Vincent Adultman')

    it 'doesn\'t use an empty name', ->
      @props.name = ''
      Testing.renderComponent( Name, props: @props ).then ({dom}) ->
        expect(dom.innerText).to.equal('Vincent Adultman')
