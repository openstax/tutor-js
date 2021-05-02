import { Factory, C, deferred } from '../../helpers';
import { ApiError } from 'shared/model';
import ErrorMonitor from '../../../src/components/error-monitoring';
import Dialog from '../../../src/components/tutor-dialog';
import { currentErrors } from '../../../src/models';

jest.mock('../../../src/components/tutor-dialog', () => ({
    hide: jest.fn(),
    show: jest.fn(() => Promise.resolve()),
}));

describe('Error monitoring: handlers', () => {
    let props;

    beforeEach(() => {
        props = {
            history: { push: jest.fn() },
            courseContext: {
                course: Factory.course(),
            },
        };
    });

    it('displays error dialog', () => {
        const em = mount(<C><ErrorMonitor {...props} /></C>);
        return deferred(() => {
            currentErrors.record(
                ApiError.fromMessage('foo', 'an err', {
                    code: 'no_exercises',
                })
            )
            em.unmount();
            expect(Dialog.show).toHaveBeenCalledWith(expect.objectContaining({
                title: 'No exercises are available',
            }));
        });
    });
});
