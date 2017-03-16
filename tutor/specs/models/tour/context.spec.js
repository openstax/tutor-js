import { bootstrapCoursesList } from '../../courses-test-data';
import { autorun } from 'mobx';
import TourRegion from '../../../src/models/tour/region';
import TourContext from '../../../src/models/tour/context';
import Tour from '../../../src/models/tour';

describe('Tour Context Model', () => {
  let context;
  let region;
  beforeEach(() => {
    context = new TourContext();
    region = new TourRegion({ id: 'foo', courseId: '1', tour_ids: ['teach-new-preview'] });
    bootstrapCoursesList();
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
    region.tour_ids = [ 'teach-new-preview', 'bar', 'baz' ];
    expect(context.tourIds).toEqual(['teach-new-preview', 'bar', 'baz']);
    expect(context.tours).toHaveLength(1);
    expect(context.tours[0].id).toEqual('teach-new-preview');
    context.closeRegion(region);
    expect(context.tours).toHaveLength(0);
  });

  it('calculates a tour based on audienceTags', () => {
    const tourSpy = jest.fn();
    autorun(() => tourSpy(context.tour));
    expect(tourSpy).toHaveBeenCalledWith(undefined);
    context.openRegion(region);
    expect(tourSpy).toHaveBeenCalledWith(Tour.forIdentifier('teach-new-preview'));
  });

  it('calculates a TourRide', () => {
    context.openRegion(region);
    expect(context.tourRide).toMatchObject({
      tour: Tour.forIdentifier('teach-new-preview'),
      region: region,
      context: context,
    });
  });

  it('knows which region is active', () => {
    context.openRegion(region);
    region.tour_ids = [ 'teach-new-preview' ];
    expect(context.activeRegion).toBe(region);
  });

  it('adds/removes anchors', () => {
    expect(context.anchors.size).toBe(0);
    context.addAnchor('test', { test: true });
    expect(context.anchors.get('test')).toEqual({ test: true });
    context.removeAnchor('test');
    expect(context.anchors.size).toBe(0);
  });

});
