{expect} = require 'chai'
_ = require 'underscore'

PerformanceForecast = require '../src/flux/performance-forecast'
LGH = PerformanceForecast.Helpers

makeSections = (valid, invalid) ->
  sections = _.times(valid, (i) ->
    # Sort the values to guarantee that minimum <= most_likely <= maximum
    values = _.sortBy([Math.random(), Math.random(), Math.random()], (n) -> n)

    clue:
      minimum: values[0],
      most_likely: values[1],
      maximum: values[2],
      is_real: true
  ).concat(
    _.times(invalid, (i) ->
      values = _.sortBy([Math.random(), Math.random(), Math.random()], (n) -> n)

      clue:
        minimum: values[0],
        most_likely: values[1],
        maximum: values[2],
        is_real: false
    )
  )
  _.shuffle(sections)

testWeakCount = ( returnedLength, sampleSizes ) ->
  for count in sampleSizes
    sections = makeSections(count, 10)
    weakest = LGH.weakestSections( sections )
    expect( weakest ).to.have.length(returnedLength)
    ourWeakest = _.sortBy( LGH.filterForecastedSections(sections), (s) -> s.clue.most_likely)
    expect(ourWeakest[0..(returnedLength - 1)]).to.deep.equal(weakest)
  undefined


describe 'Learning Guide Store', ->

  it 'returns recent', ->
    sections = makeSections(10, 3)
    expect( LGH.recentSections(sections) ).to.deep.equal( _.last(sections, 4) )
    undefined

  it 'finds sections with a valid forecast', ->
    sections = makeSections(8, 33)
    valid = LGH.filterForecastedSections(sections)
    expect( valid.length ).to.equal(8)
    expect( _.findWhere(valid, is_real: false) ).to.be.undefined
    undefined

  it 'finds the weakest sections', ->
    sections = makeSections(8, 33)
    weakest = LGH.weakestSections(sections)
    expect(weakest.length).to.equal(4)
    undefined

  it 'does not return any weakest when there is none or only one valid candidate', ->
    expect(
      LGH.weakestSections( makeSections(0, 33) )
    ).to.be.empty

    expect(
      LGH.weakestSections( makeSections(1, 33) )
    ).to.be.empty
    undefined

  it 'returns only the weakest section when there are two or three candidates', ->
    testWeakCount(1, [2, 3])

  it 'returns 2 weakest sections when there are 4 or 5 candidates', ->
    testWeakCount(2, [4, 5])

  it 'returns 3 weakest sections when there are 6 or 7 candidates', ->
    testWeakCount(3, [6, 7])

  it 'returns only the 4 weakest sections when there is more than 8 candidates', ->
    testWeakCount(4, [8, 9, 10, 11, 18, 42])
