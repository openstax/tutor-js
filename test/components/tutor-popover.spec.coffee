{Testing, sinon, expect, _, React} = require './helpers/component-testing'

TutorPopover = require '../../src/components/tutor-popover'

TEST_LINK_TEXT = 'This is the link text.'
TEST_HTML = '<p>This is the test HTML</p>
  <img src="https://cloud.githubusercontent.com/assets/2483873/9750887/734d9108-5663-11e5-9a1b-b4d10ffecb6d.png">'
FAKE_WINDOW =
  innerHeight: 600
  innerWidth: 800

checkDoesOverlayHTMLMatch = (overlayElement, html) ->
  popcontentDOM = overlayElement.refs.popcontent.getDOMNode()
  overlayDOM = overlayElement.refs.popper.getOverlayDOMNode()

  expect(popcontentDOM.innerHTML).to.equal(html)
  expect(overlayDOM.innerHTML).to.contain(html)

fakePopoverShouldRight = (popperElement) ->
  popperElement.calcOverlayPosition = ->
    overlayLeft: 100

fakePopoverShouldLeft = (popperElement) ->
  popperElement.calcOverlayPosition = ->
    overlayLeft: 600

fakePopoverShouldScroll = (popperElement) ->
  calledOnce = false

  getOverlayDOMNode = popperElement.getOverlayDOMNode
  popperElement.getOverlayDOMNode = ->
    overlayDOM = getOverlayDOMNode()
    overlayDOM.getBoundingClientRect = ->
      rect =
        height: if calledOnce then 500 else 800
      calledOnce = true
      rect
    overlayDOM

PopoverWrapper = React.createClass
  displayName: 'PopoverWrapper'
  makeProps: ->
    contentHtml = TEST_HTML
    linkProps =
      onClick: =>
        @refs.overlay.show()
      onBlur: =>
        @refs.overlay.hide()
    ref = 'overlay'

    {contentHtml, linkProps, ref}
  render: ->
    tutorPopoverProps = @makeProps()
    allProps = _.extend({}, tutorPopoverProps, @props)

    <TutorPopover {...allProps}>{TEST_LINK_TEXT}</TutorPopover>

describe 'Tutor Popover', ->

  it 'should render Tutor popover as a link with expected link text', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        expect(dom).to.have.property('tagName').and.equal('A')
        expect(dom).to.have.property('innerText').and.equal(TEST_LINK_TEXT)

  it 'should render popover html content on click', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        {overlay} = element.refs

        expect(overlay.refs.popcontent).to.be.falsy
        expect(overlay.state.show).to.be.false

        Testing.actions.click(dom)

        checkDoesOverlayHTMLMatch(overlay, TEST_HTML)
        expect(overlay.state.show).to.be.true

  it 'should close popover on blur', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        {overlay} = element.refs
        Testing.actions.click(dom)
        Testing.actions.blur(dom)

        expect(overlay.refs.popcontent).to.be.falsy
        expect(overlay.state.show).to.be.false

  it 'should open to the right when element renders left of the window middle', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        fakePopoverShouldRight(popper)
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlay.state.placement).to.equal('right')
        expect(overlayDOM.classList.contains('right')).to.be.true

  it 'should open to the left when element renders right of the window middle', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        fakePopoverShouldLeft(popper)
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlay.state.placement).to.equal('left')
        expect(overlayDOM.classList.contains('left')).to.be.true

  it 'should retrigger positioning on image first load', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        popper.updateOverlayPosition = sinon.spy()

        Testing.actions.click(dom)
        expect(popper.updateOverlayPosition).to.have.been.calledOnce

        overlayDOM = popper.getOverlayDOMNode()
        image = overlayDOM.getElementsByTagName('img')[0]
        image.onload()

        expect(overlay.state.firstShow).to.be.false
        expect(popper.updateOverlayPosition).to.have.been.calledTwice

  it 'should not set overlay height by default', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        Testing.actions.click(dom)
        overlayDOM = element.refs.overlay.refs.popper.getOverlayDOMNode()
        expect(overlayDOM.style.cssText).to.not.contain('height')

  it 'should set overlay height and be scrollable if overlay height is greater than window height', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        Testing.actions.click(dom)
        fakePopoverShouldScroll(popper)
        popper.updateOverlayPosition()
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlayDOM.style.cssText).to.contain('height')
        expect(parseInt(overlayDOM.style.height) < windowImpl.innerHeight).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true
