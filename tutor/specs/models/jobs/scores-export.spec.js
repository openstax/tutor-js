import UiSettings from 'shared/model/ui-settings';
import Export from '../../../src/models/jobs/scores-export';
import { bootstrapCoursesList } from '../../courses-test-data';
import Toasts from '../../../src/models/toasts';
import { TimeMock } from '../../helpers';

jest.useFakeTimers();

jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('Scores export job', () => {

    let course;
    let job;

    const now = TimeMock.setTo('2019-01-14T12:00:00.000Z');

    beforeEach(() => {
        course = bootstrapCoursesList().get(2);
        job = new Export(course);
    });

    afterEach(() => Toasts.clear());

    it('reports last sync time', () => {
        UiSettings.get = jest.fn(() => undefined);
        expect(job.lastExportedAt).toBeNull();
        expect(UiSettings.get).toHaveBeenCalledWith('sce', '2');
        UiSettings.get = jest.fn(() => now.toISOString());
        expect(job.lastExportedAt).toEqual(expect.stringMatching(/\d+\/\d+\/\d+/));
    });

    it('adds to queue on complete', () => {
        const data = {
            status: 'succeeded',
        };
        job.onJobUpdate({ data });
        expect(UiSettings.set).toHaveBeenCalledWith(
            'sce', '2', now.toISOString()
        );
        expect(Toasts.length).toBe(1);
        const q = Toasts[0];
        expect(q.status).toEqual('ok');
        expect(q.handler).toEqual('job');
        expect(q.type).toBe('scores');
        expect(q.id).not.toBeUndefined();
    });

});
