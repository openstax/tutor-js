import { bootstrapCoursesList } from '../../courses-test-data';
import { autorun } from 'mobx';
import TourRegion from '../../../src/models/tour/region';
import TourContext from '../../../src/models/tour/context';
import User from '../../../src/models/user';
import Tour from '../../../src/models/tour';

describe('Tour Context Model', () => {
  let context;
  let region;
  beforeEach(() => {
    context = new TourContext({ isEnabled: true });
    region = new TourRegion({ id: 'foo', courseId: '1', tour_ids: ['teacher-calendar'] });
    bootstrapCoursesList();
  });
  afterEach(() => {
    User.viewed_tour_ids.clear();
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
    region.tour_ids = ['foo']; // invalid
    context.openRegion(region);
    expect(context.tourIds).toEqual(['foo']);
    expect(context.tours).toHaveLength(0);
    region.tour_ids = [ 'teacher-calendar', 'bar', 'baz' ];
    expect(context.tourIds).toEqual(['teacher-calendar', 'bar', 'baz']);
    expect(context.tours).toHaveLength(1);
    expect(context.tours[0].id).toEqual('teacher-calendar');
    context.closeRegion(region);
    expect(context.tours).toHaveLength(0);
  });

  it('calculates a tour based on audienceTags', () => {
    const tourSpy = jest.fn();
    autorun(() => tourSpy(context.tour));
    expect(tourSpy).toHaveBeenCalledWith(null);
    context.openRegion(region);
    expect(tourSpy).toHaveBeenCalledWith(Tour.forIdentifier('teacher-calendar'));
    expect(context.tourForAudienceTags(['teacher'])).toBe(Tour.forIdentifier('teacher-calendar'));
    User.viewedTour(Tour.forIdentifier('teacher-calendar'));
    expect(context.tourForAudienceTags(['teacher'])).toBe(null);
  });

  it('calculates a TourRide', () => {
    context.openRegion(region);
    expect(context.tourRide).toMatchObject({
      tour: Tour.forIdentifier('teacher-calendar'),
      region: region,
      context: context,
    });
  });

  it('knows which region is active', () => {
    context.openRegion(region);
    region.tour_ids = [ 'teacher-calendar' ];
    expect(context.activeRegion).toBe(region);
  });

  it('adds/removes anchors', () => {
    expect(context.anchors.size).toBe(0);
    context.addAnchor('test', { test: true });
    expect(context.anchors.get('test')).toEqual({ test: true });
    context.removeAnchor('test');
    expect(context.anchors.size).toBe(0);
  });

  it('calculates when tours are replayable', () => {
    context.openRegion(region);
    expect(context.tourRide).not.toBeNull();
    expect(context.hasReplayableTours).toBe(false);
    User.viewedTour({ id: 'teacher-calendar' });
    expect(context.hasReplayableTours).toBe(true);
    expect(context.tourRide).toBeNull();
  });

  it('is disabled by default', () => {
    context = new TourContext();
    const tourSpy = jest.fn();
    autorun(() => tourSpy(context.tourIds));
    expect(tourSpy).toHaveBeenLastCalledWith([]);
    expect(context.isEnabled).toBe(false);
    context.openRegion(region);
    expect(context.tourIds).toHaveLength(0);
    context.isEnabled = true;
    expect(context.tourIds).toEqual(['teacher-calendar']);
    expect(tourSpy).toHaveBeenLastCalledWith(['teacher-calendar']);
  });

  it('emits debug info', () => {
    expect(context.debugStatus).toContain('available regions: []');
    context.openRegion(region);
    region.tour_ids = [ 'teacher-calendar' ];
    expect(context.debugStatus).toContain('available regions: [foo]');
    expect(context.debugStatus).toContain('region tour ids: [teacher-calendar]');
    expect(context.debugStatus).toContain('valid tours: [teacher-calendar]');
  });
});
