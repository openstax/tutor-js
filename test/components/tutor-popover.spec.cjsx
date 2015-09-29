{Testing, sinon, expect, _, React} = require './helpers/component-testing'

TutorPopover = require '../../src/components/tutor-popover'
ArbitraryHtml = require '../../src/components/html'

TEST_LINK_TEXT = 'This is the link text.'
TEST_HTML = '<p>This is the test HTML</p>
  <img src="https://cloud.githubusercontent.com/assets/2483873/9750887/734d9108-5663-11e5-9a1b-b4d10ffecb6d.png">
  <img src="https://cloud.githubusercontent.com/assets/2483873/10053158/0337dc14-61f0-11e5-95ba-d9fee2d88b9a.gif">'
FAKE_WINDOW =
  innerHeight: 600
  innerWidth: 800

checkDoesOverlayHTMLMatch = (overlay, html) ->
  popcontentDOM = overlay.refs.popcontent.getDOMNode()
  overlayDOM = overlay.refs.popper.getOverlayDOMNode()

  expect(popcontentDOM.innerHTML).to.contain(html)
  expect(overlayDOM.innerHTML).to.contain(html)


fakeOverflow = (popperElement, getOverlayDimensions) ->
  calledOnce = false

  getOverlayDOMNode = popperElement.getOverlayDOMNode
  popperElement.getOverlayDOMNode = ->
    overlayDOM = getOverlayDOMNode()
    overlayDOM.getBoundingClientRect = ->
      rect = getOverlayDimensions(calledOnce)
      calledOnce = true
      rect
    overlayDOM

fakePopover =
  right: (popper) ->
    popper.calcOverlayPosition = ->
      overlayLeft: 100

  left: (popper) ->
    popper.calcOverlayPosition = ->
      overlayLeft: 600

  scrollHeight: (popper) ->
    getOverlayDimensions = (calledOnce) ->
      height: if calledOnce then 500 else 800
      width: 500

    fakeOverflow(popper, getOverlayDimensions)

  scrollWidth: (popper) ->
    getOverlayDimensions = (calledOnce) ->
      width: if calledOnce then 500 else 900
      height: 500

    fakeOverflow(popper, getOverlayDimensions)

  scrollBoth: (popper) ->
    getOverlayDimensions = (calledOnce) ->
      width: if calledOnce then 500 else 900
      height: if calledOnce then 500 else 800

    fakeOverflow(popper, getOverlayDimensions)

fakePopoverShould = (fakeAs, dom, popper, overlay) ->
  Testing.actions.click(dom)
  fakePopover[fakeAs]?(popper, overlay)
  Testing.actions.blur(dom)

PopoverWrapper = React.createClass
  displayName: 'PopoverWrapper'
  makeProps: ->
    content = <ArbitraryHtml html={TEST_HTML}/>
    linkProps =
      onClick: =>
        @refs.overlay.show()
      onBlur: =>
        @refs.overlay.hide()
    ref = 'overlay'
    {content, linkProps, ref}
  render: ->
    tutorPopoverProps = @makeProps()
    allProps = _.extend({}, tutorPopoverProps, @props)
    {linkProps} = allProps

    <TutorPopover {...allProps}>
      <a {...linkProps}>{TEST_LINK_TEXT}</a>
    </TutorPopover>

fakeImageLoad = (images, overlay, iter) ->
  if images[iter].onload?
    images[iter].onload()
  else
    overlay.imageLoaded(iter)

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
        fakePopoverShould('right', dom, popper)
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
        fakePopoverShould('left', dom, popper)
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlay.state.placement).to.equal('left')
        expect(overlayDOM.classList.contains('left')).to.be.true

  it 'should retrigger positioning and have image-loading class when image(s) loading', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        popper.updateOverlayPosition = sinon.spy()
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlayDOM.querySelector('.image-loading')).to.not.be.falsy
        expect(popper.updateOverlayPosition).to.have.been.calledOnce
        expect(overlay.state.firstShow).to.be.false

        images = overlayDOM.getElementsByTagName('img')
        fakeImageLoad(images, overlay, 0)

        # Image loading should still be set when only one of two images are loaded
        expect(overlayDOM.querySelector('.image-loading')).to.not.be.falsy
        expect(popper.updateOverlayPosition).to.have.been.calledTwice

  it 'should retrigger positioning and not have image-loading when all images loaded', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        popper.updateOverlayPosition = sinon.spy()

        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()
        images = overlayDOM.getElementsByTagName('img')
        fakeImageLoad(images, overlay, 0)
        fakeImageLoad(images, overlay, 1)

        # Since all images are loaded, no images are loading anymore.
        # The DOM should reflect that.
        expect(overlay.state.imagesLoading).to.deep.equal([false, false])
        expect(overlayDOM.querySelector('.image-loading')).to.be.falsy
        expect(popper.updateOverlayPosition).to.have.been.calledThrice

  it 'should not set overlay width or height by default', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({dom, element}) ->
        Testing.actions.click(dom)
        overlayDOM = element.refs.overlay.refs.popper.getOverlayDOMNode()
        expect(overlayDOM.style.cssText).to.not.contain('height')
        expect(overlayDOM.style.cssText).to.not.contain('width')

  it 'should set overlay height and be scrollable if overlay height is greater than window height', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        fakePopoverShould('scrollHeight', dom, popper)
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlayDOM.style.cssText).to.contain('height')
        expect(parseInt(overlayDOM.style.height) < windowImpl.innerHeight).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true

  it 'should set overlay width and be scrollable if overlay width is greater than window width', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        fakePopoverShould('scrollWidth', dom, popper)
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlayDOM.style.cssText).to.contain('width')
        expect(parseInt(overlayDOM.style.width) < windowImpl.innerWidth).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true

  it 'should set overlay width and height and be scrollable if overlay size is greater than window in both', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({dom, element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        fakePopoverShould('scrollBoth', dom, popper)
        Testing.actions.click(dom)
        overlayDOM = popper.getOverlayDOMNode()

        expect(overlayDOM.style.cssText).to.contain('width')
        expect(overlayDOM.style.cssText).to.contain('height')
        expect(parseInt(overlayDOM.style.width) < windowImpl.innerWidth).to.be.true
        expect(parseInt(overlayDOM.style.height) < windowImpl.innerHeight).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true
