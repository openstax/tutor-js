import { range, map } from 'lodash';
import { observable } from 'mobx'
import { Tour, User, currentUser } from '../../src/models'
import { hydrateModel } from '../helpers';

jest.mock('../../src/models/user', () => ({
    currentUser: {
        replayTour: jest.fn(),
        get viewed_tour_stats() {
            const value = observable.array()
            Object.defineProperty(this, 'viewed_tour_stats', { value })
            return value
        },
        viewedTour: jest.fn(function(this: User, t: any){
            this.viewed_tour_stats.replace([{ id: t.id, view_count: 1 } as any]);
        }),
    },
}));

describe('Tour Model', () => {
    it('can be created', () => {
        const tour = hydrateModel(Tour, {
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
        expect(tour.isEnabled).toBeTruthy();
        expect(Tour.forIdentifier('add-homework-select-exercises').isEnabled).toBeTruthy();
    });

    it ('marks itself viewed', () => {
        const tour = Tour.forIdentifier('homework-assignment-editor');
        tour.markViewed({ exitedEarly: false });
        expect(currentUser.viewedTour).toHaveBeenCalledWith(tour, { exitedEarly: false });
        expect(tour.isEnabled).toBeFalsy();
    });

    it ('marks others in group as viewed when canceled early', () => {
        const tour = Tour.forIdentifier('homework-assignment-editor');
        tour.markViewed({ exitedEarly: true });
        expect(tour.isEnabled).toBeFalsy();
        expect(Tour.forIdentifier('add-homework-select-exercises').isEnabled).toBeFalsy();
    });

    it('calculates when an autoplay tour is viewable', () => {
        currentUser.viewed_tour_stats.clear()
        const tour = Tour.forIdentifier('question-library-super');
        expect(tour.autoplay).toBe(true);
        expect(tour.isViewed).toBe(false);
        expect(tour.standalone).toBe(true);
        expect(tour.isViewable).toBe(true);

        currentUser.viewed_tour_stats.replace([{ id: 'question-library-super', view_count: 1 }] as any);
        expect(tour.isViewable).toBe(false);
    });


});
