import Tour from '../../src/models/tour';
import { range, map } from 'lodash';
import TourData from '../../src/models/tour/data.json';

describe('Tour Model', () => {
  it('can be created', () => {
    const tour = new Tour({
      id: 2, steps: map(
        range(0, 4), i => ({ id: i, title: `step ${i}`, content: `# Step num ${i}` })
      ),
    });
    expect(tour).toBeInstanceOf(Tour);
    expect(tour.steps).toHaveLength(4);
  });

  it('initializes from JSON', () => {
    const tour = Tour.forIdentifier('teach-new-preview');
    expect(tour).toBeInstanceOf(Tour);
    expect(tour.serialize()).toMatchObject(TourData['teach-new-preview']);
  });

  it('can find by audience_tags', () => {
    expect(Tour.forAudienceTags(['foo', 'bar'])).toEqual([]);
    expect(Tour.forAudienceTags(['teacher', 'foo'])).toEqual([
      Tour.forIdentifier('teach-new-preview'),
    ]);
  });
});
