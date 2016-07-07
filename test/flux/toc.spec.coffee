{expect} = require 'chai'

_ = require 'underscore'


{TocActions, TocStore} = require '../../src/flux/toc'

READINGS  = require '../../api/ecosystems/1/readings.json'
ECOSYSTEM_ID = 1


describe 'TOC store', ->

  beforeEach (done) ->
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    done()

  it 'can find by querying things', ->
    expect(TocStore.findWhere(ECOSYSTEM_ID, cnx_id: '0e58aa87-2e09-40a7-8bf3-269b2fa16510').id).to.equal('235')
    expect(TocStore.findWhere(ECOSYSTEM_ID, {"title": "Kinematics in 2 dim"}).id).to.equal('235')

  it 'can find by uuid', ->
    expect(TocStore.getByUuid(ECOSYSTEM_ID, '0e58aa87-2e09-40a7-8bf3-269b2fa16509').id).to.equal('234')

  it 'searches by ChapterSection', ->
    expect( TocStore.findChapterSection(ECOSYSTEM_ID, '1.3').id ).to.equal('236')
