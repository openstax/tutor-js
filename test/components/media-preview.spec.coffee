{Testing, sinon, expect, _, React} = require './helpers/component-testing'

S = require '../../src/helpers/string'

{MediaActions, MediaStore} = require '../../src/flux/media'
{TaskActions, TaskStore} = require '../../src/flux/task'

taskData = require '../../api/tasks/4.json'
MediaPreview = require '../../src/components/media-preview'

checkDoesOverlayHTMLMatch = (element, media) ->
  popcontentDOM = element.refs.overlay.refs.popcontent.getDOMNode()
  overlayDOM = element.refs.overlay.refs.popper.getOverlayDOMNode()

  expect(popcontentDOM.innerHTML).to.equal(media.html)
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

  it 'should render media previewer as a link', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: '[link]'} )
      .then ({dom, element}) ->
        expect(dom).to.have.property('tagName').and.equal('A')
        expect(dom).to.have.property('classList')
        expect(dom.classList.contains('media-preview-link')).to.be.true

  it 'should render inner text as media\'s name when [link] is passed in', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: '[link]'} )
      .then ({dom, element}) ->
        expect(dom).to.have.property('innerText').and.equal(S.capitalize(media.name))

  it 'should render inner text as passed in string when not [link]', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        expect(dom).to.have.property('innerText').and.equal('this figure')

  it 'should render matching overlay HTML on mouse enter without media prop', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false
        checkDoesOverlayHTMLMatch(element, media)

  it 'should close overlay on mouse out for a non-stuck media link', ->

    TaskActions.loaded(taskData)
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
        expect(element.refs.overlay.refs.popcontent).to.be.falsy

  it 'should render matching overlay HTML on click without media prop', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        Testing.actions.click(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.true
        checkDoesOverlayHTMLMatch(element, media)

  it 'should close overlay on blur only for a stuck media link', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure'} )
      .then ({dom, element}) ->
        Testing.actions.click(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.true

        Testing.actions.mouseLeave(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.true
        checkDoesOverlayHTMLMatch(element, media)

        Testing.actions.blur(dom)
        expect(element.state.popped).to.be.false
        expect(element.state.stick).to.be.false
        expect(element.refs.overlay.refs.popcontent).to.be.falsy

  it 'should not render matching overlay HTML on click with media prop', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', media: mediaDOM} )
      .then ({dom, element}) ->

        Testing.actions.click(dom)
        expect(element.refs.overlay.refs.popcontent).to.be.falsy

  it 'should be able to determine if media in viewport', ->
    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    window = {}

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', media: mediaDOM} )
      .then ({dom, element}) ->
        fakeMediaInViewport(mediaDOM, window)
        expect(element.isMediaInViewport()).to.be.true

        fakeMediaNotInViewport(mediaDOM, window)
        expect(element.isMediaInViewport()).to.be.false


  it 'should highlight media if in viewport on mouse enter', ->
    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    window = {}
    fakeMediaInViewport(mediaDOM, window)

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', media: mediaDOM} )
      .then ({dom, element}) ->

        expect(mediaDOM.classList.contains('target')).to.be.false

        Testing.actions.mouseEnter(dom)
        expect(mediaDOM.classList.contains('target')).to.be.true

  it 'should unhighlight media if in viewport on mouse leave', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    window = {}
    fakeMediaInViewport(mediaDOM, window)

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', media: mediaDOM} )
      .then ({dom, element}) ->

        Testing.actions.mouseEnter(dom)
        Testing.actions.mouseLeave(dom)
        expect(mediaDOM.classList.contains('target')).to.be.false

  it 'should render matching overlay HTML on mouse enter if media not in viewport', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    window = {}
    fakeMediaNotInViewport(mediaDOM, window)

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', media: mediaDOM} )
      .then ({dom, element}) ->

        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false
        checkDoesOverlayHTMLMatch(element, media)

  it 'should close overlay on mouse out when media not in viewport', ->

    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()
    media = MediaStore.get(mediaIds[0])

    mediaDOM = document.createElement('div')
    mediaDOM.innerHTML = media.html
    window = {}
    fakeMediaNotInViewport(mediaDOM, window)

    Testing
      .renderComponent( MediaPreview, props: {mediaId: mediaIds[0], children: 'this figure', media: mediaDOM} )
      .then ({dom, element}) ->
        Testing.actions.mouseEnter(dom)
        expect(element.state.popped).to.be.true
        expect(element.state.stick).to.be.false

        Testing.actions.mouseLeave(dom)
        expect(element.state.popped).to.be.false
        expect(element.state.stick).to.be.false
        expect(element.refs.overlay.refs.popcontent).to.be.falsy
