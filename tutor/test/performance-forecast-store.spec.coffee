{expect} = require 'chai'
_ = require 'underscore'

PerformanceForecast = require '../src/flux/performance-forecast'
LGH = PerformanceForecast.Helpers

makeSections = (valid, invalid) ->
  sections = _.times(valid, (i) ->
    clue:
      value: Math.random(), sample_size: Math.round(Math.random() * 100 + 10),
      sample_size_interpretation: "above"
  ).concat(
    _.times(invalid, (i) ->
      clue:
        value: Math.random(), sample_size: Math.round(Math.random() * 2)
        sample_size_interpretation: "below"
    )
  )
  _.shuffle(sections)

testWeakCount = ( returnedLength, sampleSizes ) ->
  for count in sampleSizes
    sections = makeSections(count, 10)
    weakest = LGH.weakestSections( sections, 3 )
    expect( weakest ).to.have.length(returnedLength)
    ourWeakest = _.sortBy( LGH.filterForecastedSections(sections), (s) -> s.clue.value)
    expect(ourWeakest[0..(returnedLength - 1)]).to.deep.equal(weakest)


describe 'Learning Guide Store', ->

  it 'returns recent', ->
    sections = makeSections(10, 3)
    expect( LGH.recentSections(sections) ).to.deep.equal( _.last(sections, 4) )

  it 'finds sections with a valid forecast', ->
    sections = makeSections(8, 33)
    valid = LGH.filterForecastedSections(sections, 3)
    expect( valid.length ).to.equal(8)
    expect( _.findWhere(valid, sample_size_interpretation: "below") ).to.be.undefined

  it 'finds the weakest sections', ->
    sections = makeSections(8, 33)
    weakest = LGH.weakestSections(sections)
    expect(weakest.length).to.equal(4)

  it 'does not return any weakest when there is none or only one valid candidate', ->
    expect(
      LGH.weakestSections( makeSections(0, 33), 3 )
    ).to.be.empty

    expect(
      LGH.weakestSections( makeSections(1, 33), 3 )
    ).to.be.empty

  it 'returns only the weakest section when there are two or three candidates', ->
    testWeakCount(1, [2, 3])

  it 'returns 2 weakest sections when there are 4 or 5 candidates', ->
    testWeakCount(2, [4, 5])

  it 'returns 3 weakest sections when there are 6 or 7 candidates', ->
    testWeakCount(3, [6, 7])

  it 'returns only the 4 weakest sections when there is more than 8 candidates', ->
    testWeakCount(4, [8, 9, 10, 11, 18, 42])
