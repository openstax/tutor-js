import { C } from '../../helpers';
import BTB from '../../../src/components/buttons/browse-the-book';
import Factory from '../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe(BTB, () => {
    let props, course;

    beforeEach(() => {
        course = Factory.course();
        props = {
            windowImpl: new FakeWindow(),
            page: { id: 42 },
            course,
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><BTB {...props} /></C>).toMatchSnapshot();
    });

    it('can use custom tag', () => {
        props.tag = 'div';
        const btb = mount(<C><BTB {...props} /></C>);
        btb.find('div.browse-the-book').simulate('click');
        expect(props.windowImpl.open).toHaveBeenCalledWith(
            `/book/${course.id}/page/${props.page.id}`
        );
    });
});
