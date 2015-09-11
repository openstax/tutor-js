{expect} = require 'chai'
sinon = require 'sinon'
_ = require 'underscore'

{MediaActions, MediaStore} = require '../../src/flux/media'
{TaskActions, TaskStore} = require '../../src/flux/task'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../src/flux/reference-book-page'

taskData = require '../../api/tasks/4.json'
referenceBookPageData = require '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json'

expectedActions = [
  'parse'
  'reset'
]

expectedStore = [
  'get'
  'getMediaIds'
]

testMediaId = 'test-media'
testMedia = "<figure id=\"#{testMediaId}\"><figcaption>This is some test media.</figcaption></figure>"
testSecondMedia = "<table id=\"#{testMediaId}\"><thead><th>Test Table</th></thead></table>"
testHTML = "<p>Hello hi! This is pretend HTML for
  <a href=\"##{testMediaId}\">testing media stuff</a></p>
  <h1>hello this is other stuff</h1>#{testMedia}"
testSecondHTML = "<p>Hello hi! This is pretend HTML for
  <a href=\"##{testMediaId}\">testing media stuff</a></p>
  <h1>hello this is other stuff</h1>#{testSecondMedia}"
testBothHTML = "<p>Hello hi! This is pretend HTML for
  <a href=\"##{testMediaId}\">testing media stuff</a></p>
  <h1>hello this is other stuff</h1>#{testMedia}#{testSecondMedia}"

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
    MediaActions.parse(testHTML)
    media = MediaStore.get(testMediaId)

    expect(media)
      .to.have.property('name').and.equal('figure')
    expect(media)
      .to.have.property('html').and.equal(testMedia)

  it 'should be able to parse over a stored media', ->
    MediaActions.parse(testHTML)
    MediaActions.parse(testSecondHTML)
    media = MediaStore.get(testMediaId)

    expect(media)
      .to.have.property('name').and.equal('table')
    expect(media)
      .to.have.property('html').and.equal(testSecondMedia)

  it 'should pick first matching element', ->
    MediaActions.parse(testBothHTML)
    media = MediaStore.get(testMediaId)

    expect(media)
      .to.have.property('name').and.equal('figure')
    expect(media)
      .to.have.property('html').and.equal(testMedia)

  it 'should be able to parse HTML from tasks, even across steps and in questions', ->
    TaskActions.loaded(taskData)
    mediaIds = MediaStore.getMediaIds()

    expect(mediaIds)
      .to.include('figure-from-another-step').and.to.include('fig25-3')

  it 'should be able to parse HTML from reference book pages', ->
    ReferenceBookPageActions.loaded(referenceBookPageData)
    mediaIds = MediaStore.getMediaIds()

    expect(mediaIds)
      .to.have.length(10)

