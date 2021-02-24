import BookSelection from '../../../src/components/tags/book-selection';

describe('Book Selection tags component', () => {
    let props;
    beforeEach(() => {
        props = {
            onChange: jest.fn(),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<BookSelection {...props} />).toMatchSnapshot();
    });

    it('calls onChange', () => {
        const bs = mount(<BookSelection {...props} />);
        bs.find('BookSelection select').simulate('change', {
            target: { value: 'stax-apphys' },
        });
        expect(props.onChange).toHaveBeenCalled();
        bs.unmount();
    });

    it('limits selection', () => {
        props.limit = ['stax-soc', 'stax-bio'];
        const bs = mount(<BookSelection {...props} />);
        expect(bs.find('option').map(o => o.props().value)).toEqual([
            '', 'stax-soc', 'stax-bio',
        ]);
        bs.unmount();
    });

});
