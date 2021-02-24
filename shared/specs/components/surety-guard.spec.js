import { ld, React } from 'shared/specs/helpers';
import SuretyGuard from 'components/surety-guard';

const WrappedComponent = (props) => (
    <SuretyGuard {...props}>
        <a>
      i am a test link
        </a>
    </SuretyGuard>
);

describe('SuretyGuard', function() {
    let props = null;

    beforeEach(() => {
        props = {
            onConfirm: jest.fn(),
            message: 'Yo!, you sure?',
        };
    });

    it('renders children', () => {
        const guard = mount(<WrappedComponent {...props} />);
        expect(guard.text()).toContain('test link');
        guard.unmount();
    });

    it('displays when clicked', () => {
        const guard = mount(<WrappedComponent {...props} />);
        guard.simulate('click');
        return new Promise(done => {
            ld.defer(() => {
                expect(
                    window.document.querySelector('.openstax-surety-guard')
                ).toBeTruthy();
                guard.unmount();
                done();
            });
        });

    });

});
