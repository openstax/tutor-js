import { bootstrapCoursesList } from '../../courses-test-data';
import { autorun } from 'mobx';
import TourContext from '../../../src/models/tour/context';
import Tour from '../../../src/models/tour';

describe('Tour Context Model', () => {
  let context;

  beforeEach(() => {
    context = new TourContext();
    bootstrapCoursesList();
  });

  it('calculates regions', () => {
    context.updateRegion('foo', { courseId: '1', tourIds: ['foo', 'bar'] });
    expect(context.tourIds).toEqual(['foo', 'bar']);
    context.updateRegion('bar', { courseId: '1', tourIds: ['baz', 'bar'] });
    expect(context.tourIds).toEqual(['foo', 'bar', 'baz']);
  });

  it('calculates courses', () => {
    context.updateRegion('foo', { courseId: '1', tourIds: ['foo', 'bar'] });
    expect(context.courseIds).toEqual(['1']);
    context.updateRegion('bar', { courseId: '2', tourIds: ['foo', 'bar'] });
    expect(context.courseIds).toEqual(['1', '2']);
    context.updateRegion('bar', { courseId: '5', tourIds: ['foo', 'bar'] });
    expect(context.courseIds).toEqual(['1', '5']);
  });

  it('converts ids to tours', () => {
    context.updateRegion('foo', { courseId: '1', tourIds: ['foo', 'bar'] });
    expect(context.tours).toHaveLength(0); // 'foo' & 'bar' are invalid ids
    context.updateRegion('foo', { courseId: '1', tourIds: ['teach-new-preview'] });
    expect(context.tours).toHaveLength(1);
    expect(context.tours[0].id).toEqual('teach-new-preview');
  });

  it('calculates a tour based on audienceTags', () => {
    const tourSpy = jest.fn();
    autorun(() => tourSpy(context.tour));
    expect(tourSpy).toHaveBeenCalledWith(undefined);
    context.updateRegion('foo', { courseId: '1', tourIds: ['teach-new-preview'] });
    expect(tourSpy).toHaveBeenCalledWith(Tour.forIdentifier('teach-new-preview'));
  });

  it('calculates props for react joyride', () => {
    expect(context.joyrideProps).toEqual({});
    context.updateRegion('foo', { courseId: '1', tourIds: ['teach-new-preview'] });
    expect(context.joyrideProps).toMatchObject({
      tourId: 'teach-new-preview',
    });
  });

});
