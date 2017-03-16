import { autorun } from 'mobx';
import TourRegion from '../../../src/models/tour/region';


describe('Tour Region Model', () => {

  it('can bootstrap from JSON', () => {
    const tour = TourRegion.forIdentifier('teacher-calendar');
    expect(tour.serialize()).toMatchObject({
      'id': 'teacher-calendar',
    });
  });

});
