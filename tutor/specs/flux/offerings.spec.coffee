_ = require 'underscore'

{OfferingsStore, OfferingsActions} = require '../../src/flux/offerings'
OFFERINGS = require '../../api/offerings'

describe 'Offerings Store', ->

  beforeEach ->
    OfferingsActions.loaded(OFFERINGS, 'all')

  it 'can get a filtered list of offerings', ->
    expect(OfferingsStore.filter(is_concept_coach: true)).to.deep.equal(
      [ _.last(OFFERINGS.items) ]
    )
    expect(OfferingsStore.filter(is_concept_coach: false)).to.deep.equal(
      OFFERINGS.items[0...OFFERINGS.items.length - 1]
    )
    undefined

  it 'can get offering title', ->
    expect(OfferingsStore.getTitle('1')).to.equal('Biology')
    undefined

  it 'can get offering description', ->
    expect(OfferingsStore.getDescription('1')).to.equal('Biology with Courseware')
    undefined

  it 'limits terms for CC', ->
    expect(OfferingsStore.getValidTerms('5')).toEqual([
      {"term": "spring", "year": 2017},
      {"term": "summer", "year": 2017},
    ])
    undefined
