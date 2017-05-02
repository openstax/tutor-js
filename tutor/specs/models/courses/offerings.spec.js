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
});
