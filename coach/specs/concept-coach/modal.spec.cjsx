{Testing, sinon, _, React} = require 'shared/specs/helpers'

jest.mock 'navigation/model'
Navigation = require 'navigation/model'
last = require 'lodash/last'
{CCModal} = require 'concept-coach/modal'
api = require 'api'

describe 'CC Modal Component', ->
  beforeEach ->
    @props =
      filterClick: sinon.spy (clickEvent) ->
        true
      children: <button id="click-me"/>

    # simulate click manually.
    # The event listener for this is outside of React's simulated event system,
    # because it needs to be the first check for all click and focus events on `document`.
    @click = (el, onClick) ->
      ev = document.createEvent("MouseEvent")
      clickArguments = [
        "click",
        true, # bubble
        true, #cancelable
        window, null,
        0, 0, 0, 0, # coordinates
        false, false, false, false, # modifier keys
        0, # left
        null
      ]
      ev.initMouseEvent(clickArguments...)
      el.addEventListener('click', (clickEvent) ->
        onClick(clickEvent)
      )
      el.dispatchEvent(ev)

  it 'scrolls to top only when view changes', ->
    wrapper = shallow(<CCModal {...@props} />)
    node = {scrollTop: 100}
    sinon.stub(wrapper.instance(), 'getDomNode', -> node) # = jest.fn(node)
    expect(Navigation.channel.on).toHaveBeenCalled()
    last(Navigation.channel.on.mock.calls)[1](view: 'test')
    expect(node.scrollTop).to.eq(0)
    node.scrollTop = 100
    last(Navigation.channel.on.mock.calls)[1](view: 'test')
    expect(node.scrollTop).to.eq(100)
    last(Navigation.channel.on.mock.calls)[1](view: 'test-new-view')
    expect(node.scrollTop).to.eq(0)
    undefined

  it 'sets isLoaded class if api call is pending', ->
    sinon.stub(api, 'isPending').returns(true)
    Testing.renderComponent( CCModal, props: @props).then ({dom}) ->
      expect(dom.classList.contains('loaded')).to.be.false
      api.channel.emit('*.*.*.receive.*')
      expect(dom.classList.contains('loaded')).to.be.true

  it 'calls filter click on a click event that is not within the modal DOM', ->
    Testing.renderComponent( CCModal, props: @props).then ({root, dom, element}) =>
      button = dom.querySelector('#click-me')

      # since this element is inside the modal, filter click should not run
      @click(button, element.checkAllowed)
      expect(@props.filterClick).not.to.have.been.called

      # elements focused on or clicked on outside the modal should be checked
      @click(root, element.checkAllowed)
      expect(@props.filterClick).to.have.been.called
