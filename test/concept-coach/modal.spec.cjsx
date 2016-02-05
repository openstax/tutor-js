{Testing, expect, sinon, _, React} = require 'openstax-react-components/test/helpers'

{CCModal} = require 'concept-coach/modal'
api = require 'api'

describe 'CC Modal Component', ->
  beforeEach ->
    @props =
      filterClick: sinon.spy (clickEvent) ->
        true
      children: <button id="click-me"/>


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

  it 'sets isLoaded class if api call is pending', ->
    sinon.stub(api, 'isPending').returns(true)
    Testing.renderComponent( CCModal, props: @props).then ({dom}) ->
      expect(dom.classList.contains('loaded')).to.be.false
      api.channel.emit('completed')
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

