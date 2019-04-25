import { C, EnzymeContext } from '../../helpers';
import BTB from '../../../src/components/buttons/browse-the-book';
import Factory from '../../factories';
import ChapterSection from '../../../src/models/chapter-section';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe(BTB, () => {
  let props, course;

  beforeEach(() => {
    course = Factory.course();
    props = {
      windowImpl: new FakeWindow(),
      chapterSection: new ChapterSection('1.2'),
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
      `/book/${course.id}/section/${props.chapterSection.asString}`
    );
  });
});
