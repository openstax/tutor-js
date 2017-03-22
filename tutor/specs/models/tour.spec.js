import Tour from '../../src/models/tour';
import { range, map } from 'lodash';
import TourData from '../../src/tours';

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
    const tours = Tour.forAudienceTags(['teacher', 'foo']);
    expect(tours.length).toBeGreaterThan(0);
    expect(map(tours, 'id')).toContain('teach-new-preview');
  });
});
