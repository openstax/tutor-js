{Testing, sinon, expect, _, React} = require './helpers/component-testing'

TutorPopover = require '../../src/components/tutor-popover'
{ArbitraryHtmlAndMath} = require 'shared'

TEST_LINK_TEXT = 'This is the link text.'
TEST_HTML = '<p>This is the test HTML</p>
  <img src="https://cloud.githubusercontent.com/assets/2483873/9750887/734d9108-5663-11e5-9a1b-b4d10ffecb6d.png">
  <img src="https://cloud.githubusercontent.com/assets/2483873/10053158/0337dc14-61f0-11e5-95ba-d9fee2d88b9a.gif">'
FAKE_WINDOW =
  innerHeight: 600
  innerWidth: 800

checkDoesOverlayHTMLMatch = (overlay, html) ->
  popcontentDOM = overlay.refs.popcontent.getDOMNode()
  overlayDOM = overlay.refs.popover.getDOMNode()

  expect(popcontentDOM.innerHTML).to.contain(html)
  expect(overlayDOM.innerHTML).to.contain(html)


fakeOverflow = (popperElement, overlay, getOverlayDimensions) ->
  calledOnce = false

  getOverlayDOMNode = overlay.refs.popover.getDOMNode
  overlay.refs.popover.getDOMNode = ->
    overlayDOM = getOverlayDOMNode()
    overlayDOM.getBoundingClientRect = ->
      rect = getOverlayDimensions(calledOnce)
      calledOnce = true
      rect
    overlayDOM

fakePopover =
  right: (popper) ->
    getPopperDOMNode = popper.getDOMNode
    popper.getDOMNode = ->
      popperDOMNode = getPopperDOMNode()
      popperDOMNode.getBoundingClientRect = ->
        left: 100

      popperDOMNode

  left: (popper) ->
    getPopperDOMNode = popper.getDOMNode
    popper.getDOMNode = ->
      popperDOMNode = getPopperDOMNode()
      popperDOMNode.getBoundingClientRect = ->
        left: 600

      popperDOMNode

  scrollHeight: (popper, overlay) ->
    getOverlayDimensions = (calledOnce) ->
      height: if calledOnce then 500 else 800
      width: 500

    fakeOverflow(popper, overlay, getOverlayDimensions)

  scrollWidth: (popper, overlay) ->
    getOverlayDimensions = (calledOnce) ->
      width: if calledOnce then 500 else 900
      height: 500

    fakeOverflow(popper, overlay, getOverlayDimensions)

  scrollBoth: (popper, overlay) ->
    getOverlayDimensions = (calledOnce) ->
      width: if calledOnce then 500 else 900
      height: if calledOnce then 500 else 800

    fakeOverflow(popper, overlay, getOverlayDimensions)

fakePopoverShould = (fakeAs, dom, popper, overlay) ->
  Testing.actions.click(dom)
  fakePopover[fakeAs]?(popper, overlay)
  Testing.actions.blur(dom)

PopoverWrapper = React.createClass
  displayName: 'PopoverWrapper'
  makeProps: ->
    content = <ArbitraryHtmlAndMath html={TEST_HTML}/>
    linkProps =
      onClick: =>
        @refs.overlay.show()
      onBlur: =>
        @refs.overlay.hide()
    ref = 'overlay'
    overlayProps =
      container: @
    {content, linkProps, ref, overlayProps}
  render: ->
    tutorPopoverProps = @makeProps()
    allProps = _.extend({}, tutorPopoverProps, @props)
    {linkProps} = allProps
    <div className='popover-container'>
      <TutorPopover {...allProps}>
        <a {...linkProps}>{TEST_LINK_TEXT}</a>
      </TutorPopover>
    </div>

fakeImageLoad = (images, overlay, iter) ->
  if images[iter].onload?
    images[iter].onload()
  else
    overlay.imageLoaded(iter)

describe 'Tutor Popover', ->

  it 'should render Tutor popover as a link with expected link text', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({element}) ->
        linkDOM = element.refs.overlay.getDOMNode()
        expect(linkDOM).to.have.property('tagName').and.equal('A')
        expect(linkDOM).to.have.property('innerText').and.equal(TEST_LINK_TEXT)

  it 'should render popover html content on click', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({element}) ->
        {overlay} = element.refs
        linkDOM = element.refs.overlay.getDOMNode()

        expect(overlay.refs.popcontent).to.not.be.ok
        expect(overlay.state.show).to.be.false

        Testing.actions.click(linkDOM)
        checkDoesOverlayHTMLMatch(overlay, TEST_HTML)
        expect(overlay.state.show).to.be.true

  it 'should close popover on blur', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({element}) ->
        {overlay} = element.refs
        linkDOM = element.refs.overlay.getDOMNode()

        Testing.actions.click(linkDOM)
        Testing.actions.blur(linkDOM)

        expect(overlay.state.show).to.be.false

  it 'should open to the right when element renders left of the window middle', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        fakePopoverShould('right', linkDOM, popper, overlay)
        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()

        expect(overlay.state.placement).to.equal('right')
        expect(overlayDOM.classList.contains('right')).to.be.true

  it 'should open to the left when element renders right of the window middle', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        fakePopoverShould('left', linkDOM, popper, overlay)
        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()

        expect(overlay.state.placement).to.equal('left')
        expect(overlayDOM.classList.contains('left')).to.be.true

  xit 'should retrigger positioning and have image-loading class when image(s) loading', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()

        expect(overlayDOM.querySelector('.image-loading')).to.be.ok
        expect(overlay.state.firstShow).to.be.false

        images = overlayDOM.getElementsByTagName('img')
        fakeImageLoad(images, overlay, 0)

        # Image loading should still be set when only one of two images are loaded
        expect(overlayDOM.querySelector('.image-loading')).to.be.ok

  it 'should retrigger positioning and not have image-loading when all images loaded', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()
        images = overlayDOM.getElementsByTagName('img')
        fakeImageLoad(images, overlay, 0)
        fakeImageLoad(images, overlay, 1)

        # Since all images are loaded, no images are loading anymore.
        # The DOM should reflect that.
        expect(overlay.state.imagesLoading).to.deep.equal([false, false])
        expect(overlayDOM.querySelector('.image-loading')).to.not.be.ok

  it 'should not set overlay width or height by default', ->
    Testing
      .renderComponent( PopoverWrapper )
      .then ({element}) ->
        linkDOM = element.refs.overlay.getDOMNode()

        Testing.actions.click(linkDOM)
        overlayDOM = element.refs.overlay.refs.popover.getDOMNode()
        expect(overlayDOM.style.cssText).to.not.contain('height')
        expect(overlayDOM.style.cssText).to.not.contain('width')

  xit 'should set overlay height and be scrollable if overlay height is greater than window height', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        fakePopoverShould('scrollHeight', linkDOM, popper, overlay)
        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()

        expect(overlayDOM.style.cssText).to.contain('height')
        expect(parseInt(overlayDOM.style.height) < windowImpl.innerHeight).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true

  xit 'should set overlay width and be scrollable if overlay width is greater than window width', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        fakePopoverShould('scrollWidth', linkDOM, popper, overlay)
        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()

        expect(overlayDOM.style.cssText).to.contain('width')
        expect(parseInt(overlayDOM.style.width) < windowImpl.innerWidth).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true

  xit 'should set overlay width and height and be scrollable if overlay size is greater than window in both', ->
    windowImpl = _.clone(FAKE_WINDOW)

    Testing
      .renderComponent( PopoverWrapper , props: {windowImpl})
      .then ({element}) ->
        {overlay} = element.refs
        {popper} = overlay.refs
        linkDOM = element.refs.overlay.getDOMNode()

        fakePopoverShould('scrollBoth', linkDOM, popper, overlay)
        Testing.actions.click(linkDOM)
        overlayDOM = overlay.refs.popover.getDOMNode()

        expect(overlayDOM.style.cssText).to.contain('width')
        expect(overlayDOM.style.cssText).to.contain('height')
        expect(parseInt(overlayDOM.style.width) < windowImpl.innerWidth).to.be.true
        expect(parseInt(overlayDOM.style.height) < windowImpl.innerHeight).to.be.true
        expect(overlay.state.scrollable).to.be.true
        expect(overlayDOM.classList.contains('scrollable')).to.be.true
