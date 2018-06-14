import DATA from '../../../api/offerings';
import Offerings from '../../../src/models/course/offerings';
import OfferingsModel from '../../../src/models/course/offerings/offering';
import { filter, every } from 'lodash';

describe('Offerings Model', function() {

  beforeEach(() => Offerings.onLoaded({ data: DATA }));

  it('creates models', function() {
    expect(Offerings.array.length).toBe(5);
    expect(every(Offerings.array, (o) => o instanceof OfferingsModel)).toBeTruthy();
  });

  it('has models that know about CC', () => {
    expect(filter(Offerings.array, { is_concept_coach: true })).toHaveLength(1);
  });

  it('can get offering title', () => {
    expect(Offerings.get('1').title).to.equal('Biology');
  });

  it('can get offering description', () => {
    expect(Offerings.get('1').description).to.equal('Biology with Courseware');
  });

  it('filters for biology2e', () => {
    const offering = Offerings.get('1');
    offering.appearance_code = 'biology_2e';
    expect(Offerings.biology2e.array).toHaveLength(1);
    expect(offering.isLegacyBiology).toBe(false);
    offering.appearance_code = 'college_biology';
    expect(offering.isLegacyBiology).toBe(true);
  });

  it('limits CC to spring/summer 2017', () => {
    const offering = new OfferingsModel({
      id: 42,
      is_concept_coach: true,
      active_term_years: [
        { year: 2017, term: 'summer' },
        { year: 2017, term: 'fall' },
        { year: 2018, term: 'winter' },
      ],
    });
    expect(offering.validTerms).toHaveLength(1);
    expect(offering.validTerms[0].serialize()).toEqual({ term: 'summer', year: 2017 });
  });
});
