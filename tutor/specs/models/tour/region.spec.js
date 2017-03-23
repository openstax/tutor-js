import { autorun } from 'mobx';
import TourRegion from '../../../src/models/tour/region';


describe('Tour Region Model', () => {

  it('can bootstrap from JSON', () => {
    const tour = TourRegion.forIdentifier('teacher-calendar');
    expect(tour.serialize()).toMatchObject({
      'id': 'teacher-calendar',
    });
  });

  it('finds tour_ids', () => {
    const region = TourRegion.forIdentifier('homework-assignment-editor');
    expect(region.tour_ids.peek()).toEqual(['add-homework-builder']);
  });

});
