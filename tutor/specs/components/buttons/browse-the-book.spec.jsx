import { C, EnzymeContext } from '../../helpers';
import BTB from '../../../src/components/buttons/browse-the-book';
import Factory from '../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe(BTB, () => {
  let props, course, book;

  beforeEach(() => {
    course = Factory.course();
    book = Factory.book({ id: course.ecosystem_id });
    props = {
      windowImpl: new FakeWindow(),
      chapterSection: '1.2',
      course,
    };
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(<C><BTB {...props} /></C>).toMatchSnapshot();
  });

  it('can use custom tag', () => {
    const context = EnzymeContext.build();
    props.tag = 'div';
    const btb = mount(<BTB {...props} />, context);
    btb.find('div.browse-the-book').simulate('click');
    expect(props.windowImpl.open).toHaveBeenCalledWith(
      `/book/${course.ecosystem_id}/section/${props.chapterSection}`
    );
  });
});
