import UiSettings from 'shared/model/ui-settings';
import Push from '../../../src/models/jobs/lms-score-push';
import { bootstrapCoursesList } from '../../courses-test-data';
import { Completed } from '../../../src/models/jobs/queue';

const mockNowDate = new Date();
jest.useFakeTimers();
jest.mock('../../../src/flux/time', () => ({
  TimeStore: { getNow: jest.fn(() => mockNowDate) },
}));

jest.mock('shared/model/ui-settings');

describe('LMS Score push job', () => {

  let course;
  let job;

  beforeEach(() => {
    course = bootstrapCoursesList().get(2);
    job = new Push(course);
  });

  afterEach(() => Completed.clear());

  it('reports last sync time', () => {
    UiSettings.get = jest.fn(() => undefined);
    expect(job.lastPushedAt).toBeNull();
    expect(UiSettings.get).toHaveBeenCalledWith('sclp', '2');
    UiSettings.get = jest.fn(() => mockNowDate);
    expect(job.lastPushedAt).toEqual(expect.stringMatching(/\d+\/\d+\/\d+/));
  });

  it('adds to queue on complete', () => {
    const data = {
      status: 'succeeded',
      data: { num_callbacks: 1 },
    };
    job.onJobUpdate({ data });
    expect(UiSettings.set).toHaveBeenCalledWith(
      'sclp', '2', mockNowDate.toISOString()
    );
    expect(Completed.length).toBe(1);
    const q = Completed[0];
    expect(q.succeeded).toBe(true);
    expect(q.type).toBe('lms');
    expect(q.id).not.toBeUndefined();
  });

});
