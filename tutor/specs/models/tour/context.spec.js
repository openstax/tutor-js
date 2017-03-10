import { bootstrapCoursesList } from '../../courses-test-data';
import { autorun } from 'mobx';
import TourContext from '../../../src/models/tour/context';
import Tour from '../../../src/models/tour';

describe('Tour Context Model', () => {
  let context;

  beforeEach(() => {
    context = new TourContext({ courseId: '1', tourIds: ['foo', 'bar'] });
    bootstrapCoursesList();
  });

  it('can be created from JSON', () => {
    expect(context.serialize()).toEqual({ courseId: '1', tourIds: ['foo', 'bar'] });
  });

  it('converts ids to tours', () => {
    expect(context.tours).toHaveLength(0); // 'foo' & 'bar' are invalid ids
    context.tourIds = ['teach-new-preview'];
    expect(context.tours).toHaveLength(1);
    expect(context.tours[0].id).toEqual('teach-new-preview');
  });

  it('calculates current tour based on audianceTags', () => {
    const tourSpy = jest.fn();
    autorun(() => tourSpy(context.tour));
    expect(tourSpy).toHaveBeenCalledWith(undefined);
    context.tourIds = ['teach-new-preview'];
    expect(tourSpy).toHaveBeenCalledWith(Tour.forIdentifier('teach-new-preview'));
  });
});
