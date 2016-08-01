{expect} = require 'chai'
_ = require 'underscore'

S = require '../../src/helpers/string'

capitalizeStrings = [
  'Apple'
  'Corn'
  'I am hungry'
]

sortStringsOnly = [
  [
    '@pples'
    'apples'
    'Goodbye'
    'goodbye'
    'hello'
  ]
]

sortNumbersOnly = [
  [
    0
    1
    8
    9
    10
    10
    10.5
    12.245
    12.246
    100
  ]
]

sortNumbersAndStrings = [
  [
    0
    '0th'
    1
    '1st'
    '1th'
    2
    '8th'
    '9th'
    '10th'
    '10th'
    10.25
    '10.5th'
    '12.245th'
    '12.246th'
    90
    '100th'
    'Block B'
    'Block b'
    'monKeys'
    'monkeys'
    'th'
  ]
]

testSortOrderHelper = (originalArray) ->
  rando = _.shuffle(originalArray)
  firstSortRando = _.clone(rando).sort()
  sortedByFunc = _.sortBy(firstSortRando, S.getNumberAndStringOrder)
  expect(sortedByFunc.join(',')).to.equal(originalArray.join(','))

toRandomCase = (string) ->
  cases = ['toLowerCase', 'toUpperCase']

  randomedChars = _.map(string, (letter) ->
    randomCase = cases[_.random(0, 1)]
    randoedLetter = letter[randomCase]()
    randoedLetter
  )

  randomedChars.join('')


describe 'String helpers', ->

  it 'capitalizes', ->
    _.each(capitalizeStrings, (stringToMatch) ->
      allCapsString = stringToMatch.toUpperCase()
      allLowerString = stringToMatch.toLowerCase()
      randomCasedString = toRandomCase(stringToMatch)

      expect(S.capitalize(allCapsString)).to.equal(stringToMatch)
      expect(S.capitalize(allLowerString)).to.equal(stringToMatch)
      expect(S.capitalize(randomCasedString)).to.equal(stringToMatch)
    )

  it 'helps sort strings and numbers', ->
    _.each(sortNumbersAndStrings, (numAndStrings) ->
      testSortOrderHelper(numAndStrings)
    )

  it 'helps sort numbers only', ->
    _.each(sortNumbersOnly, (numbersOnly) ->
      testSortOrderHelper(numbersOnly)
    )

  it 'helps sort strings only', ->
    _.each(sortStringsOnly, (stringsOnly) ->
      testSortOrderHelper(stringsOnly)
    )

  it 'can titleize a string', ->
    # straight up title
    expect(S.titleize('foo bar baz')).to.equal('Foo Bar Baz')
    # ignores short words
    expect(S.titleize('the 1st bar in a row went via postal mail')).to
      .equal('The 1st Bar in a Row Went via Postal Mail')
    # treats underscores and dashes properly
    expect(S.titleize('my_words_are_concatenated-please help')).to
      .equal('My Words Are Concatenated-Please Help')
