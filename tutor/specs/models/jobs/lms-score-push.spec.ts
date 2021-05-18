import { TimeMock, Factory } from '../../helpers';
import UiSettings from 'shared/model/ui-settings';
import { LmsScorePushJob, currentToasts } from '../../../src/models'

jest.useFakeTimers();

jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('LMS Score push job', () => {

    let course: ReturnType<typeof Factory.course>;
    let job: LmsScorePushJob;

    const mockedNow = TimeMock.setTo(new Date());

    beforeEach(() => {
        course = Factory.course({ id: '2' })
        job = new LmsScorePushJob(course);
    });

    afterEach(() => currentToasts.clear());

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
        job.onJobUpdate(data);
        expect(UiSettings.set).toHaveBeenCalledWith(
            'sclp', '2', mockedNow.toISOString()
        );
        expect(currentToasts.length).toBe(1);
        const q = currentToasts[0];
        expect(q.status).toEqual('ok');
        expect(q.handler).toEqual('job');
        expect(q.type).toBe('lms');
        expect(q.id).not.toBeUndefined();
    });

});
