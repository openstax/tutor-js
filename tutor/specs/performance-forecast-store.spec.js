import { expect } from 'chai';
import _ from 'underscore';

import PerformanceForecast from '../src/flux/performance-forecast';
const LGH = PerformanceForecast.Helpers;

const makeSections = function(valid, invalid) {
  const sections = _.times(valid, function(i) {
    // Sort the values to guarantee that minimum <= most_likely <= maximum
    const values = _.sortBy([Math.random(), Math.random(), Math.random()], n => n);

    return {
      clue: {
        minimum: values[0],
        most_likely: values[1],
        maximum: values[2],
        is_real: true,
      },
    };
  }).concat(
    _.times(invalid, function(i) {
      const values = _.sortBy([Math.random(), Math.random(), Math.random()], n => n);

      return {
        clue: {
          minimum: values[0],
          most_likely: values[1],
          maximum: values[2],
          is_real: false,
        },
      };
    })
  );
  return _.shuffle(sections);
};

const testWeakCount = function( returnedLength, sampleSizes ) {
  for (let count of sampleSizes) {
    const sections = makeSections(count, 10);
    const weakest = LGH.weakestSections( sections );
    expect( weakest ).to.have.length(returnedLength);
    const ourWeakest = _.sortBy( LGH.filterForecastedSections(sections), s => s.clue.most_likely);
    expect(ourWeakest.slice(0, +(returnedLength - 1) + 1 || undefined)).to.deep.equal(weakest);
  }
  return undefined;
};


describe('Learning Guide Store', function() {

  it('returns recent', function() {
    const sections = makeSections(10, 3);
    expect( LGH.recentSections(sections) ).to.deep.equal( _.last(sections, 4) );
    return undefined;
  });

  it('finds sections with a valid forecast', function() {
    const sections = makeSections(8, 33);
    const valid = LGH.filterForecastedSections(sections);
    expect( valid.length ).to.equal(8);
    expect( _.findWhere(valid, { is_real: false }) ).to.be.undefined;
    return undefined;
  });

  it('finds the weakest sections', function() {
    const sections = makeSections(8, 33);
    const weakest = LGH.weakestSections(sections);
    expect(weakest.length).to.equal(4);
    return undefined;
  });

  it('does not return any weakest when there is none or only one valid candidate', function() {
    expect(
      LGH.weakestSections( makeSections(0, 33) )
    ).to.be.empty;

    expect(
      LGH.weakestSections( makeSections(1, 33) )
    ).to.be.empty;
    return undefined;
  });

  it('returns only the weakest section when there are two or three candidates', () => testWeakCount(1, [2, 3]));

  it('returns 2 weakest sections when there are 4 or 5 candidates', () => testWeakCount(2, [4, 5]));

  it('returns 3 weakest sections when there are 6 or 7 candidates', () => testWeakCount(3, [6, 7]));

  return it('returns only the 4 weakest sections when there is more than 8 candidates', () => testWeakCount(4, [8, 9, 10, 11, 18, 42]));
});
