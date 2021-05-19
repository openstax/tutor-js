import UiSettings from 'shared/model/ui-settings';
import { TimeMock, Factory } from '../../helpers';
import { Toast, ScoresExportJob as Export, currentToasts } from '../../../src/models'


jest.useFakeTimers();

jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('Scores export job', () => {

    let course: ReturnType<typeof Factory.course>;
    let job: Export;

    const now = TimeMock.setTo('2019-01-14T12:00:00.000Z');

    beforeEach(() => {
        course = Factory.course({ id: '2' })
        job = new Export(course);
    });

    afterEach(() => currentToasts.clear());

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
        job.onJobUpdate(data);
        expect(UiSettings.set).toHaveBeenCalledWith(
            'sce', '2', now.toISOString()
        );
        expect(currentToasts.length).toBe(1);
        const q = currentToasts[0];
        expect(q).toBeInstanceOf(Toast)
        expect(q.status).toEqual('ok');
        expect(q.handler).toEqual('job');
        expect(q.type).toBe('scores');
        expect(q.id).not.toBeUndefined();
    });

});
