import UiSettings from 'shared/src/model/ui-settings';
import Export from '../../../src/models/jobs/scores-export';
import { bootstrapCoursesList } from '../../courses-test-data';
import { Completed } from '../../../src/models/jobs/queue';

const mockNowDate = new Date();
jest.useFakeTimers();
jest.mock('../../../src/flux/time', () => ({
  TimeStore: { getNow: jest.fn(() => mockNowDate) },
}));

jest.mock('shared/src/model/ui-settings');

describe('Scores export job', () => {

  let course;
  let job;

  beforeEach(() => {
    course = bootstrapCoursesList().get(2);
    job = new Export(course);
  });

  afterEach(() => Completed.clear());

  it('reports last sync time', () => {
    UiSettings.get = jest.fn(() => undefined);
    expect(job.lastExportedAt).toBeNull();
    expect(UiSettings.get).toHaveBeenCalledWith('sce', '2');
    UiSettings.get = jest.fn(() => mockNowDate);
    expect(job.lastExportedAt).toEqual(expect.stringMatching(/\d+\/\d+\/\d+/));
  });

  it('adds to queue on complete', () => {
    const data = {
      status: 'succeeded',
    };
    job.onJobUpdate({ data });
    expect(UiSettings.set).toHaveBeenCalledWith(
      'sce', '2', mockNowDate.toISOString()
    );
    expect(Completed.length).toBe(1);
    const q = Completed[0];
    expect(q.succeeded).toBe(true);
    expect(q.type).toBe('scores');
    expect(q.id).not.toBeUndefined();
  });

});
