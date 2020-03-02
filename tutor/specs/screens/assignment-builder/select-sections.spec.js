import { C, FakeWindow } from '../../helpers';
import Factory, { FactoryBot } from '../../factories';
import SelectSections from '../../../src/screens/assignment-builder/select-sections';
import UX from '../../../src/screens/assignment-builder/ux';

jest.mock('../../../src/helpers/scroll-to');

describe('Select Topics', function() {
  let props;

  beforeEach(async () => {
    const course = Factory.course();
    const plan = Factory.teacherTaskPlan({ course });
    const ux = new UX();
    await ux.initialize({ course, plan, windowImpl: new FakeWindow });
    ux.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });

    props = {
      ux,
      header: 'Section Chooser Header',
    };
  });

  it('renders chooser', function() {
    const s = mount(<C><SelectSections {...props} /></C>);
    expect(s).toHaveRendered('SectionsChooser');
    s.unmount();
  });

  it('scrolls into view on mount', () => {
    const ce = mount(<C><SelectSections {...props} /></C>);
    expect(props.ux.scroller.scrollToElement).toHaveBeenCalled();
    ce.unmount();
  });

});
