import { C, ld } from '../../helpers';
import Factory, { FactoryBot } from '../../factories';
import SelectTopics from '../../../src/screens/assignment-builder/select-topics';
import HOMEWORK from '../../../api/plans/2.json';
import ScrollTo from '../../../src/helpers/scroll-to';

jest.mock('../../../src/helpers/scroll-to');

describe('Select Topics', function() {
  let props;

  beforeEach(() => {
    const course = Factory.course();
    course.referenceBook.onApiRequestComplete({
      data: [FactoryBot.create('Book')],
    });

    props = {
      course,
      type: 'homework',
      planId: HOMEWORK.id,
      onSectionChange: jest.fn(),
      hide: jest.fn(),
      selected: [],
      header: 'Section Chooser Header',
      cancel: jest.fn(),
    };
  });

  it('matches snapshot', function() {
    expect.snapshot(<C><SelectTopics {...props} /></C>).toMatchSnapshot();
  });

  it('scrolls into view on mount', () => {
    const ce = mount(<C><SelectTopics {...props} /></C>);
    expect(ld.last(ScrollTo.mock.instances).scrollToSelector).toHaveBeenCalledWith('.select-topics');
    ce.unmount();
  });

});
