_ = require 'underscore'

{OfferingsStore, OfferingsActions} = require '../../src/flux/offerings'
OFFERINGS = require '../../api/offerings'

describe 'Offerings Store', ->

  beforeEach ->
    OfferingsActions.loaded(OFFERINGS, 'all')

  it 'can get all offerings', ->
    expect(OfferingsStore.all()).to.deep.equal(OFFERINGS.items)
    undefined

  it 'can get offering title', ->
    expect(OfferingsStore.getTitle('1')).to.equal('College Biology')
    undefined
