{Testing, sinon, expect, _, React} = require './helpers/component-testing'

S = require '../../src/helpers/string'

PAGE_ID = '17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'
MEDIA_ID_FROM_ANOTHER_MODULE = 'Figure_01_01_Stonehenge'

{MediaActions, MediaStore} = require '../../src/flux/media'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../src/flux/reference-book-page'
{TaskActions, TaskStore} = require '../../src/flux/task'

TASK_DATA = require '../../api/tasks/4.json'
PAGE_DATA = require '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json'
{MediaPreview} = require '../../src/components/media-preview'

checkDoesOverlayHTMLMatch = (overlay, media) ->
  popcontentDOM = overlay.refs.popcontent.getDOMNode()
  overlayDOM = overlay.refs.popper.getOverlayDOMNode()

  expect(popcontentDOM.innerHTML).to.contain(media.html)
  expect(overlayDOM.innerHTML).to.contain(media.html)

fakeMediaInViewport = (mediaDOM, window) ->
  mediaDOM.getBoundingClientRect = ->
    left: 200
    right: 300
    top: 20
    height: 300
    bottom: 320
    width: 400

  window.innerHeight = 400

fakeMediaNotInViewport = (mediaDOM, window) ->
  mediaDOM.getBoundingClientRect = ->
    left: 200
    right: 300
    top: 400
    height: 300
    bottom: 700
    width: 400

  window.innerHeight = 400


describe 'Media Preview', ->

  afterEach ->
    MediaActions.reset()
    TaskActions.reset()
    ReferenceBookPageActions.reset()

  it 'should render media previewer as a link', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: '[link]'} )
      .then ({dom, element}) ->
        expect(dom).to.have.property('tagName').and.equal('A')
        expect(dom).to.have.property('classList')
        expect(dom.classList.contains('media-preview-link')).to.be.true

  it 'should render inner text as media\'s name when [link] is passed in', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: '[link]'} )
      .then ({dom, element}) ->
        expect(dom).to.have.property('innerText').and.equal(S.capitalize(media.name))

  it 'should render inner text as passed in string when not [link]', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        expect(dom).to.have.property('innerText').and.equal('this figure')

  it 'should render matching overlay HTML on mouse enter without media prop', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false
        checkDoesOverlayHTMLMatch(element.refs.overlay, media)

  it 'should close overlay on mouse out for a non-stuck media link', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false

        Testing.actions.mouseLeave(dom)
        expect(element.state.popped).to.be.false
        expect(element.state.stick).to.be.false
        expect(element.refs.overlay.refs.popcontent).to.not.be.ok

  it 'should render external link book link when without media prop and shouldLinkOut is true', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    mediaId = mediaIds[0]
    media = MediaStore.get(mediaId)
    bookHref = 'link-to-book'

    props = {mediaId: mediaId, bookHref: bookHref, children: 'this figure', shouldLinkOut: true}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->
        expect(dom.href).to.contain(bookHref).and.to.contain(mediaId)
        expect(dom.target).to.equal('_blank')

  it 'should not render external link book link when without media prop and shouldLinkOut is false', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    mediaId = mediaIds[0]
    media = MediaStore.get(mediaId)
    bookHref = 'link-to-book'

    props = {mediaId: mediaId, bookHref: bookHref, children: 'this figure', shouldLinkOut: false}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->
        expect(dom.href).to.not.contain(bookHref).and.to.not.contain(mediaId)
        expect(dom.target).to.not.equal('_blank')

  it 'should not render matching overlay HTML on click with media prop', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', mediaDOMOnParent: mediaDOM} )
      .then ({dom, element}) ->

        Testing.actions.click(dom)
        expect(element.refs.overlay.refs.popcontent).to.not.be.ok

  it 'should be able to determine if media in viewport', ->
    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    windowImpl = {}
    props = {mediaId: mediaIds[0], children: 'this figure', mediaDOMOnParent: mediaDOM, windowImpl: windowImpl}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->
        fakeMediaInViewport(mediaDOM, windowImpl)
        expect(element.isMediaInViewport()).to.be.true

        fakeMediaNotInViewport(mediaDOM, windowImpl)
        expect(element.isMediaInViewport()).to.be.false


  it 'should highlight media if in viewport on mouse enter', ->
    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    windowImpl = {}
    fakeMediaInViewport(mediaDOM, windowImpl)
    props = {mediaId: mediaIds[0], children: 'this figure', mediaDOMOnParent: mediaDOM, windowImpl: windowImpl}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->

        expect(mediaDOM.classList.contains('link-target')).to.be.false

        Testing.actions.mouseEnter(dom)
        expect(mediaDOM.classList.contains('link-target')).to.be.true

  it 'should unhighlight media if in viewport on mouse leave', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    windowImpl = {}
    fakeMediaInViewport(mediaDOM, windowImpl)
    props = {mediaId: mediaIds[0], children: 'this figure', mediaDOMOnParent: mediaDOM, windowImpl: windowImpl}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->

        Testing.actions.mouseEnter(dom)
        Testing.actions.mouseLeave(dom)
        expect(mediaDOM.classList.contains('link-target')).to.be.false

  it 'should render matching overlay HTML on mouse enter if media not in viewport', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    windowImpl = {}
    fakeMediaNotInViewport(mediaDOM, windowImpl)
    props = {mediaId: mediaIds[0], children: 'this figure', mediaDOMOnParent: mediaDOM, windowImpl: windowImpl}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->

        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false
        checkDoesOverlayHTMLMatch(element.refs.overlay, media)

  it 'should close overlay on mouse out when media not in viewport', ->

    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    windowImpl = {}
    fakeMediaNotInViewport(mediaDOM, windowImpl)
    props = {mediaId: mediaIds[0], children: 'this figure', mediaDOMOnParent: mediaDOM, windowImpl: windowImpl}

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->
        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false

        Testing.actions.mouseLeave(dom)
        expect(element.state.popped).to.be.false
        expect(element.state.stick).to.be.false
        expect(element.refs.overlay.refs.popcontent).to.not.be.ok

  it 'should display as plain link if media is not loaded and does not load', ->

    TaskActions.loaded(TASK_DATA)

    props =
      mediaId: MEDIA_ID_FROM_ANOTHER_MODULE
      children: 'no figure'
      cnxId: PAGE_ID
      bookHref: "link-to-book/#{PAGE_ID}"

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->
        expect(dom.href).to.contain(props.bookHref).and.to.contain(props.mediaId)
        expect(dom.target).to.equal('_blank')

        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.false
        expect(element.state.stick).to.be.false
        expect(element.state.media).to.not.be.ok

  it 'should (attempt to) display as previewer if media does load', (done) ->

    TaskActions.loaded(TASK_DATA)

    props =
      mediaId: MEDIA_ID_FROM_ANOTHER_MODULE
      children: 'this figure'
      cnxId: PAGE_ID
      bookHref: "link-to-book/#{PAGE_ID}"

    Testing
      .renderComponent( MediaPreview, props: props )
      .then ({dom, element}) ->
        # Unsure as to why, but calling .loaded on ReferenceBookPageActions triggers an
        # unmount on the test MediaPreview component.

        # Wanted to test for rendering the previewer with newly loaded media html, but we'll just
        # have to settle for testing for MediaStore.get on unmount for now.
        checkMedia = (media) ->
          expect(media).to.be.ok
          expect(media).to.have.property('name')
          expect(media).to.have.property('html')

        originalUnmount = element.componentWillUnmount
        element.componentWillUnmount = ->
          media = MediaStore.get(element.props.mediaId)
          checkMedia(media)
          originalUnmount.call(element)
          done()

        expect(MediaStore.get(props.mediaId)).to.not.be.ok
        ReferenceBookPageActions.loaded(PAGE_DATA, PAGE_ID)
