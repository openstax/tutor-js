import { StepLockIcon } from '../../../src/components/icons/lock';

describe('StepLockIcon', () => {
    it('does not render the lock icon when wasGraded and isClosed are both false', () => {
        const stepLockIcon = mount(<StepLockIcon wasGraded={false} isClosed={false} />);
        expect(stepLockIcon).not.toHaveRendered('.ox-icon-lock');
    });

    it('renders the lock icon when wasGraded is true', () => {
        const stepLockIcon = mount(<StepLockIcon wasGraded={true} isClosed={false} />);
        expect(stepLockIcon).toHaveRendered('.ox-icon-lock');
    });

    it('renders the lock icon when isClosed is true', () => {
        const stepLockIcon = mount(<StepLockIcon wasGraded={false} isClosed={true} />);
        expect(stepLockIcon).toHaveRendered('.ox-icon-lock');
    });
});
