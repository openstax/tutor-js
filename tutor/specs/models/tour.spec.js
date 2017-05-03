import Tour from '../../src/models/tour';
import { range, map } from 'lodash';
import TourData from '../../src/tours';

jest.mock('../../src/models/user', () => ({
  replayTour: jest.fn(),
  viewedTour: jest.fn(),
}));


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
    const tour = Tour.forIdentifier('teacher-calendar');
    expect(tour).toBeInstanceOf(Tour);
    expect(tour.serialize()).toMatchObject(TourData['teacher-calendar']);
  });

  it('can find by audience_tags', () => {
    expect(Tour.forAudienceTags(['foo', 'bar'])).toEqual([]);
    const tours = Tour.forAudienceTags(['teacher', 'foo']);
    expect(tours.length).toBeGreaterThan(0);
    expect(map(tours, 'id')).toContain('teacher-calendar');
  });

  it('finds all', () => {
    expect(Tour.all.length).toBeGreaterThan(10);
  });

  it('finds others in the same group', () => {
    const tour = new Tour();
    expect(tour.othersInGroup).toEqual([]);
    tour.group_id = 'bad';
    expect(tour.othersInGroup).toEqual([]);
    tour.group_id = 'homework';
    expect(tour.othersInGroup.length).toBeGreaterThan(2);
  });

  it ('replays itself and others in group', () => {
    const tour = Tour.forIdentifier('homework-assignment-editor');
    tour.play();
    expect(tour.isAvailable).toBeTruthy();
    expect(Tour.forIdentifier('add-homework-select-exercises').isAvailable).toBeTruthy();
  });

  it ('marks itself viewed', () => {
    const tour = Tour.forIdentifier('homework-assignment-editor');
    tour.markViewed({ exitedEarly: false });
    expect(tour.isAvailable).toBeFalsy();
  });

  it ('marks others in group as viewed when canceled early', () => {
    const tour = Tour.forIdentifier('homework-assignment-editor');
    tour.markViewed({ exitedEarly: true });
    expect(tour.isAvailable).toBeFalsy();
    expect(Tour.forIdentifier('add-homework-select-exercises').isAvailable).toBeFalsy();
  });
});
