import { NudgeMessage, NudgeMessages } from '../../../../src/screens/task/step/nudge-message';
import { Factory, TimeMock } from '../../../helpers';
import { ResponseValidationUX } from '../../../../src/screens/task/response-validation-ux';

jest.mock('../../../../src/screens/task/response-validation-ux');

describe('Free Response Nudge Messages', () => {
    let props;
    let ux;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const task = Factory.studentTask({ type: 'homework', stepCount: 1 });
        const step = task.steps[0];
        ux = new ResponseValidationUX();
        ux.displayNudgeError = true;
        props = {
            step, ux,
            course: Factory.course(),
        };
    });

    it('matches snapshot', () => {
        expect(<NudgeMessage {...props} />).toMatchSnapshot();
        NudgeMessages.forEach(m => {
            ux.nudge = m;
            expect(<NudgeMessage {...props} />).toMatchSnapshot();
        });
    });

    it('submits message', () => {
        ux.submitOriginalResponse = jest.fn();
        ux.nudge = NudgeMessages[0];
        const msg = mount(<NudgeMessage {...props} />);
        msg.find('Submit a').simulate('click');
        expect(ux.submitOriginalResponse).toHaveBeenCalled();
        msg.unmount();
    });

});
