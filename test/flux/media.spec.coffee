{expect} = require 'chai'
sinon = require 'sinon'
_ = require 'underscore'

{MediaActions, MediaStore} = require '../../src/flux/media'
{TaskActions, TaskStore} = require '../../src/flux/task'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../src/flux/reference-book-page'

TASK_DATA = require '../../api/tasks/4.json'
REFERENCE_BOOK_PAGE_DATA = require '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json'

TEST_MEDIA_ID = 'test-media'
TEST_MEDIA = "<figure id=\"#{TEST_MEDIA_ID}\"><figcaption>This is some test media.</figcaption></figure>"
TEST_SECOND_MEDIA = "<table id=\"#{TEST_MEDIA_ID}\"><thead><th>Test Table</th></thead></table>"
TEST_HTML = "<p>Hello hi! This is pretend HTML for
  <a href=\"##{TEST_MEDIA_ID}\">testing media stuff</a></p>
  <h1>hello this is other stuff</h1>#{TEST_MEDIA}"
TEST_SECOND_HTML = "<p>Hello hi! This is pretend HTML for
  <a href=\"##{TEST_MEDIA_ID}\">testing media stuff</a></p>
  <h1>hello this is other stuff</h1>#{TEST_SECOND_MEDIA}"
TEST_BOTH_HTML = "<p>Hello hi! This is pretend HTML for
  <a href=\"##{TEST_MEDIA_ID}\">testing media stuff</a></p>
  <h1>hello this is other stuff</h1>#{TEST_MEDIA}#{TEST_SECOND_MEDIA}"

expectedActions = [
  'parse'
  'reset'
]

expectedStore = [
  'get'
  'getMediaIds'
]

describe 'Media flux', ->

  afterEach ->
    MediaActions.reset()
    TaskActions.reset()
    ReferenceBookPageActions.reset()

  it 'should have expected functions', ->

    _.each(expectedActions, (action) ->
      expect(MediaActions)
        .to.have.property(action).that.is.a('function')
    )

    _.each(expectedStore, (storeAsker) ->
      expect(MediaStore)
        .to.have.property(storeAsker).that.is.a('function')
    )

  it 'should be able to parse HTML with links and pick out targeted media', ->
    MediaActions.parse(TEST_HTML)
    media = MediaStore.get(TEST_MEDIA_ID)

    expect(media)
      .to.have.property('name').and.equal('figure')
    expect(media)
      .to.have.property('html').and.equal(TEST_MEDIA)

  it 'should be able to parse over a stored media', ->
    MediaActions.parse(TEST_HTML)
    MediaActions.parse(TEST_SECOND_HTML)
    media = MediaStore.get(TEST_MEDIA_ID)

    expect(media)
      .to.have.property('name').and.equal('table')
    expect(media)
      .to.have.property('html').and.equal(TEST_SECOND_MEDIA)

  it 'should pick first matching element', ->
    MediaActions.parse(TEST_BOTH_HTML)
    media = MediaStore.get(TEST_MEDIA_ID)

    expect(media)
      .to.have.property('name').and.equal('figure')
    expect(media)
      .to.have.property('html').and.equal(TEST_MEDIA)

  it 'should be able to parse HTML from tasks, even across steps and in questions', ->
    TaskActions.loaded(TASK_DATA)
    mediaIds = MediaStore.getMediaIds()

    expect(mediaIds)
      .to.include('figure-from-another-step').and.to.include('fig25-3')

  it 'should be able to parse HTML from reference book pages', ->
    ReferenceBookPageActions.loaded(REFERENCE_BOOK_PAGE_DATA)
    mediaIds = MediaStore.getMediaIds()

    expect(mediaIds)
      .to.have.length(10)

