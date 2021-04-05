import { bootstrapCoursesList } from '../../courses-test-data';
import { autorun, observable } from 'mobx';
import { each } from 'lodash';

import TourRegion from '../../../src/models/tour/region';
import TourContext from '../../../src/models/tour/context';
import User from '../../../src/models/user';
import Tour from '../../../src/models/tour';
import browser from 'detect-browser';
import { hydrateModel } from 'modeled-mobx';

jest.mock('detect-browser', () => ({
    name: 'not-ie',
}));
describe('Tour Context Model', () => {
    let context: TourContext;
    let region: TourRegion;

    beforeEach(() => {
        context = new TourContext();
        region = hydrateModel(TourRegion, { id: 'foo', courseId: '2', otherTours: ['teacher-calendar'] });
        bootstrapCoursesList();
    });
    afterEach(() => {
        browser.name = 'not-ie';
        User.viewed_tour_stats.clear();
        each(Tour.all, t => {
            t.isEnabled = false;
        });
    });


    it('calculates courses', () => {
        const region1 = new TourRegion({ id: 'foo1', courseId: '1', tour_ids: ['foo'] });
        context.openRegion(region1);
        expect(context.courseIds).toEqual(['1']);
        const region2 = new TourRegion({ id: 'foo2', tour_ids: ['foo'] });
        context.openRegion(region2);
        expect(context.courseIds).toEqual(['1']);
        region2.courseId = '3';
        expect(context.courseIds).toEqual(['1', '3']);
        context.closeRegion(region1);
        expect(context.courseIds).toEqual(['3']);
        context.closeRegion(region2);
        expect(context.courseIds).toEqual([]);
    });

    it('converts ids to tours', () => {
        region.otherTours = []; // id of foo is invalid
        context.openRegion(region);
        expect(context.tourIds).toEqual(['foo']);
        expect(context.eligibleTours).toHaveLength(0);
        region.otherTours = [ 'teacher-calendar', 'bar', 'baz' ];
        expect(context.tourIds).toEqual(['foo', 'teacher-calendar', 'bar', 'baz']);
        expect(context.eligibleTours).toHaveLength(1);
        expect(context.eligibleTours[0].id).toEqual('teacher-calendar');
        context.closeRegion(region);
        expect(context.eligibleTours).toHaveLength(0);
    });

    it('calculates tours', () => {
        const tourSpy = jest.fn();
        autorun(() => tourSpy(context.tour));
        expect(tourSpy).toHaveBeenCalledWith(null);
        context.openRegion(region);
        expect(context.eligibleTours).toHaveLength(1);
        context.playTriggeredTours();
        expect(context.tour).not.toBeNull();
        expect(tourSpy).toHaveBeenCalledWith(Tour.forIdentifier('teacher-calendar'));
        context.tour.markViewed({ exitedEarly: false });
        expect(context.tour).toBeNull();
    });

    it('calculates a TourRide', () => {
        context.openRegion(region);
        context.playTriggeredTours();
        expect(context.tourRide).toMatchObject({
            tour: Tour.forIdentifier('teacher-calendar'),
            region: region,
            context: context,
        });
    });

    it('knows which region is active', () => {
        context.openRegion(region);
        context.playTriggeredTours();
        expect(context.activeRegion).toBe(region);
    });

    it('adds/removes anchors', () => {
        expect(context.anchors.size).toBe(0);
        context.addAnchor('test', { test: true });
        expect(context.anchors.get('test')).toEqual({ test: true });
        context.removeAnchor('test');
        expect(context.anchors.size).toBe(0);
    });

    it('can be disabled by other observable', () => {
        expect(context.isEnabled).toBe(true);
        context.openRegion(region);
        context.playTriggeredTours();
        expect(context.tour).not.toBeNull();
        context.otherModal = observable({
            isDisplaying: true,
        });
        expect(context.tour).toBeNull();
        context.otherModal.isDisplaying = false;
        expect(context.tour).not.toBeNull();
    });

    it('emits debug info', () => {
        expect(context.debugStatus).toContain('available regions: []');
        context.openRegion(region);
        expect(context.debugStatus).toContain('available regions: [foo]');
        expect(context.debugStatus).toContain('region tour ids: [foo,teacher-calendar]');
        expect(context.debugStatus).toContain('eligible tours: [teacher-calendar]');
    });

    it('replays all valid tours', () => {
        region.id = 'homework-assignment-editor';
        context.openRegion(region);
        expect(context.eligibleTours).toHaveLength(2);
        expect(context.tour).toBeNull();
        context.playTriggeredTours();
        expect(context.tour).toBe(Tour.forIdentifier('homework-assignment-editor'));
    });

    it('closes ride when it changes', () => {
        context.openRegion(region);
        context.playTriggeredTours();
        context.closeRegion(region);
        expect(context.tour).toBeNull();
        expect(context.tourRide).toBeNull();
    });
});
