import ld from 'lodash';
import moment from 'moment';
import * as PerformanceForecast from '../../src/flux/performance-forecast';
const LGH = PerformanceForecast.Helpers;

const makeSections = function(valid, invalid) {
  const sections = ld.times(valid, function() {
    // Sort the values to guarantee that minimum <= most_likely <= maximum
    const values = ld.sortBy([Math.random(), Math.random(), Math.random()], n => n);

    return {
      clue: {
        minimum: values[0],
        most_likely: values[1],
        maximum: values[2],
        is_real: true,
      },
      first_worked_at: moment().format(),
      last_worked_at: moment().format(),
    };
  }).concat(
    ld.times(invalid, function() {
      const values = ld.sortBy([Math.random(), Math.random(), Math.random()], n => n);

      return {
        clue: {
          minimum: values[0],
          most_likely: values[1],
          maximum: values[2],
          is_real: false,
        },
        first_worked_at: null,
        last_worked_at: null,
      };
    })
  );
  return ld.shuffle(sections);
};

const testWeakCount = function( returnedLength, sampleSizes ) {
  for (let count of sampleSizes) {
    const sections = makeSections(count, 10);
    const weakest = LGH.weakestSections( sections );
    expect( weakest ).toHaveLength(returnedLength);
    const ourWeakest = ld.sortBy( LGH.filterForecastedSections(sections), s => s.clue.most_likely);
    expect(ourWeakest.slice(0, +(returnedLength - 1) + 1 || undefined)).toEqual(weakest);
  }
  return undefined;
};


describe('Learning Guide Store', function() {

  it('returns recent', function() {
    const sections = makeSections(10, 3);
    expect( LGH.recentSections(sections) ).toEqual(
      ld.take(ld.orderBy(ld.filter(sections, s => s.last_worked_at), 'last_worked_at', 'desc'), 4)
    );
  });

  it('finds sections with a valid forecast', function() {
    const sections = makeSections(8, 33);
    const valid = LGH.filterForecastedSections(sections);
    expect( valid.length ).toEqual(8);
    expect( ld.find(valid, { is_real: false }) ).toBeUndefined();
  });

  it('finds the weakest sections', function() {
    const sections = makeSections(8, 33);
    const weakest = LGH.weakestSections(sections);
    expect(weakest.length).toEqual(4);
  });

  it('does not return any weakest when there is none or only one valid candidate', function() {
    expect(
      LGH.weakestSections( makeSections(0, 33) )
    ).toHaveLength(0);

    expect(
      LGH.weakestSections( makeSections(1, 33) )
    ).toHaveLength(0);
  });

  it('returns only the weakest section when there are two or three candidates', () => testWeakCount(1, [2, 3]));

  it('returns 2 weakest sections when there are 4 or 5 candidates', () => testWeakCount(2, [4, 5]));

  it('returns 3 weakest sections when there are 6 or 7 candidates', () => testWeakCount(3, [6, 7]));

  it('returns only the 4 weakest sections when there is more than 8 candidates', () => testWeakCount(4, [8, 9, 10, 11, 18, 42]));
});
