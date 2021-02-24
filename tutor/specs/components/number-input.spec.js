import NumberInput from '../../src/components/number-input';

let mockedOnChange = jest.fn();

jest.mock('formik', () => ({
    useField: () => [{
        onChange: mockedOnChange,
    }],
}));

describe('Number Input', () => {

    let props;

    beforeEach(() => {
        mockedOnChange = jest.fn();
        props = {
            name: 'numberz',
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<NumberInput {...props} />).toMatchSnapshot();
    });

    it('calls onchange', () => {
        const ni = mount(<NumberInput {...props} />);
        ni.find('input').simulate('change', { target: { value: '42' } });
        expect(mockedOnChange).toHaveBeenCalledWith({
            target: { name: 'numberz', value: 42 },
        });
        ni.unmount();
    });

});
