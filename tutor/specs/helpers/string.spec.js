import ld from 'underscore';

import S from '../../src/helpers/string';

const capitalizeStrings = [
  'Apple',
  'Corn',
  'I am hungry',
];

const sortStringsOnly = [[
  '@pples',
  'apples',
  'Goodbye',
  'goodbye',
  'hello',
]];

const sortNumbersOnly = [[
  0,
  1,
  8,
  9,
  10,
  10,
  10.5,
  12.245,
  12.246,
  100,
]];

const sortNumbersAndStrings = [[
  0,
  '0th',
  1,
  '1st',
  '1th',
  2,
  '8th',
  '9th',
  '10th',
  '10th',
  10.25,
  '10.5th',
  '12.245th',
  '12.246th',
  90,
  '100th',
  'Block B',
  'Block b',
  'monKeys',
  'monkeys',
  'th',
]];

const testSortOrderHelper = function(originalArray) {
  const rando = ld.shuffle(originalArray);
  const firstSortRando = ld.clone(rando).sort();
  const sortedByFunc = ld.sortBy(firstSortRando, S.getNumberAndStringOrder);
  return expect(sortedByFunc.join(',')).toEqual(originalArray.join(','));
};

const toRandomCase = function(string) {
  const cases = ['toLowerCase', 'toUpperCase'];

  const randomedChars = ld.map(string, function(letter) {
    const randomCase = cases[ld.random(0, 1)];
    const randoedLetter = letter[randomCase]();
    return randoedLetter;
  });

  return randomedChars.join('');
};


describe('String helpers', function() {

  it('capitalizes', function() {
    ld.each(capitalizeStrings, function(stringToMatch) {
      const allCapsString = stringToMatch.toUpperCase();
      const allLowerString = stringToMatch.toLowerCase();
      const randomCasedString = toRandomCase(stringToMatch);

      expect(S.capitalize(allCapsString)).toEqual(stringToMatch);
      expect(S.capitalize(allLowerString)).toEqual(stringToMatch);
      return expect(S.capitalize(randomCasedString)).toEqual(stringToMatch);
    });
    return undefined;
  });

  it('helps sort strings and numbers', function() {
    ld.each(sortNumbersAndStrings, numAndStrings => testSortOrderHelper(numAndStrings));
    return undefined;
  });

  it('helps sort numbers only', function() {
    ld.each(sortNumbersOnly, numbersOnly => testSortOrderHelper(numbersOnly));
    return undefined;
  });

  it('helps sort strings only', function() {
    ld.each(sortStringsOnly, stringsOnly => testSortOrderHelper(stringsOnly));
    return undefined;
  });

  it('can titleize a string', function() {
    // straight up title
    expect(S.titleize('foo bar baz')).toEqual('Foo Bar Baz');
    // ignores short words
    expect(S.titleize('the 1st bar in a row went via postal mail'))
      .toEqual('The 1st Bar in a Row Went via Postal Mail');
    // treats underscores and dashes properly
    expect(S.titleize('my_words_are_concatenated-please help'))
      .toEqual('My Words Are Concatenated-Please Help');
    return undefined;
  });

  it('join into a sentence', function() {
    expect(S.toSentence(['foo', 'bar', 'baz'])).toEqual('foo, bar and baz');
    return expect(S.toSentence('foo bar baz')).toEqual('foo, bar and baz');
  });

  it('matches uuid', function() {
    expect(S.isUUID('blah')).toEqual(false);
    return expect(S.isUUID('cc3c6ff9-83d8-4375-94be-8c7ae3024938')).toEqual(true);
  });

  it('tests isEmpty', function() {
    expect(S.isEmpty()).toBe(true);
    expect(S.isEmpty(undefined)).toBe(true);
    expect(S.isEmpty({})).toBe(true);
    expect(S.isEmpty(' ')).toBe(true);
    expect(S.isEmpty('not empty')).toBe(false);
  });

  it('strips html', function() {
    expect(S.stripHTMLTags(
      '<span class="os-number">1</span><span class="os-divider"> </span><span class="os-text">The Study of Life</span>'
    )).toEqual('1 The Study of Life');
    expect(S.stripHTMLTags(null)).toBeNull();
  });

});
