import AsyncLoadErrors from '../../../src/components/error-monitoring/async-load-error';
import { isReloaded, forceReload } from '../../../src/helpers/reload';
jest.mock('../../../src/helpers/reload');

const ErrorProne = ({ error, children }) => {
    if (error) { throw error; }
    return children;
};

describe('AsyncLoadErrors Component', function() {
    let consoleMocks;

    beforeEach(() => {
        consoleMocks = [
            jest.spyOn(console, 'error'),
            jest.spyOn(console, 'warn'),
        ];
        consoleMocks.forEach(m => m.mockImplementation(() => {}));
    });

    afterEach(() => {
        consoleMocks.forEach(m => m.mockRestore());
    });

    it('renders when error', () => {
        const err = mount(
            <AsyncLoadErrors>
                <ErrorProne error={new Error('hi, im an error')}/>
                <p>I should not be shown</p>
            </AsyncLoadErrors>
        );
        expect(err.text()).toContain('hi, im an error');
    });

    it('renders and matches snapshot when there is no error', () => {
        isReloaded.mockImplementation(() => true);
        const err = (
            <AsyncLoadErrors>
                <ErrorProne>
                    <p>I should be shown</p>
                </ErrorProne>
            </AsyncLoadErrors>
        );
        expect.snapshot(err).toMatchSnapshot();
    });

    it('renders and matches snapshot when there is an error', () => {
        isReloaded.mockImplementation(() => true);
        const err = (
            <AsyncLoadErrors>
                <ErrorProne error={new Error('hi, im an error')}>
                    <p>I should not be shown</p>
                </ErrorProne>
            </AsyncLoadErrors>
        );
        expect.snapshot(err).toMatchSnapshot();
    });

    it('forces a reload when clicked', () => {
        isReloaded.mockImplementation(() => true);
        const err = mount(
            <AsyncLoadErrors>
                <ErrorProne error={new Error('hi, im an error')} />
                <p>I should not be shown</p>
            </AsyncLoadErrors>
        );
        err.find('Button').simulate('click');
        expect(forceReload).toHaveBeenCalled();
    });
});
