import { TimeMock } from '../../helpers';
import UiSettings from 'shared/model/ui-settings';
import Push from '../../../src/models/jobs/lms-score-push';
import { bootstrapCoursesList } from '../../courses-test-data';
import Toasts from '../../../src/models/toasts';

jest.useFakeTimers();

jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('LMS Score push job', () => {

    let course;
    let job;

    const mockedNow = TimeMock.setTo(new Date());

    beforeEach(() => {
        course = bootstrapCoursesList().get(2);
        job = new Push(course);
    });

    afterEach(() => Toasts.clear());

    it('reports last sync time', () => {
        UiSettings.get = jest.fn(() => undefined);
        expect(job.lastPushedAt).toBeNull();
        expect(UiSettings.get).toHaveBeenCalledWith('sclp', '2');
        UiSettings.get = jest.fn(() => mockedNow.toISOString());
        expect(job.lastPushedAt).toEqual(expect.stringMatching(/\d+\/\d+\/\d+/));
    });

    it('adds to queue on complete', () => {
        const data = {
            status: 'succeeded',
            data: { num_callbacks: 1 },
        };
        job.onJobUpdate({ data });
        expect(UiSettings.set).toHaveBeenCalledWith(
            'sclp', '2', mockedNow.toISOString()
        );
        expect(Toasts.length).toBe(1);
        const q = Toasts[0];
        expect(q.status).toEqual('ok');
        expect(q.handler).toEqual('job');
        expect(q.type).toBe('lms');
        expect(q.id).not.toBeUndefined();
    });

});
