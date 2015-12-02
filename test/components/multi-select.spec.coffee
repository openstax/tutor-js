{Testing, expect, sinon, _} = require './helpers/component-testing'

MultiSelect = require '../../src/components/multi-select'

SELECTIONS = [
  { id: 't',  title: 'Turkey',           selected: true  }
  { id: 'h',  title: 'Ham',              selected: false }
  { id: 'p',  title: 'Potatoes & Gravy', selected: true  }
  { id: 'gb', title: 'Green Beans',      selected: false }
  { id: 'cb', title: 'Cranberries',      selected: false }
  { id: 'st', title: 'Stuffing',         selected: true  }
]

describe 'MultiSelect component', ->
  beforeEach ->
    @props = {
      id: 'foods'
      title: 'Food Selections'
      selections: SELECTIONS
    }

  it 'renders selections', ->
    Testing.renderComponent( MultiSelect, props: @props ).then ({dom}) ->
      options = _.pluck(dom.querySelectorAll('.dropdown-menu li'), 'textContent')
      expect(options).to.deep.equal(_.pluck(SELECTIONS, 'title'))

  it 'renders as selected/unselected', ->
    Testing.renderComponent( MultiSelect, props: @props ).then ({dom}) ->
      for selection, index in SELECTIONS
        classList = _.toArray dom.querySelector(".dropdown-menu li:nth-child(#{index+1}) .tutor-icon").classList
        expect(classList).to.include(if selection.selected then 'fa-check-square-o' else 'fa-square-o')

  it 'fires callback when selected', ->
    @props.onSelect = sinon.spy()
    Testing.renderComponent( MultiSelect, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.dropdown-menu li:first-child a'))
      expect(@props.onSelect).to.have.been.calledWith(SELECTIONS[0])
