import Reading from '../../../src/screens/assignment-builder/reading';
import { C, TimeMock, createUX, setTaskDates } from './helpers';

describe('Reading Builder', function() {
  let props, ux;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(async () => {
    ux = await createUX({ now, type: 'reading' });
    props = { ux };
  });

  it('works on happy path', function() {
    props.ux.plan.settings.page_ids = [];

    const read = mount(<C><Reading {...props} /></C>);

    read.find('.assignment-name input').simulate('change', {
      target: { value: 'a reading' },
    });
    read.find('.assignment-description textarea').simulate('change', {
      target: { value: 'a reading description' },
    });

    expect(props.ux.plan.isPublished).toBe(false);
    expect(props.ux.canEdit).toBe(true);

    const { due_at, opens_at } = setTaskDates({ form: read, now });

    read.find('button#select-sections').simulate('click');
    expect(read).toHaveRendered('SelectSections');
    read.find('.chapter-checkbox button').at(1).simulate('click');
    read.find('.card-footer button#add-section-to-reading').simulate('click');

    jest.spyOn(props.ux.plan, 'save');
    read.find('SaveButton AsyncButton').simulate('click');
    expect(props.ux.plan.save).toHaveBeenCalled();

    expect(props.ux.plan.dataForSave).toEqual({
      type: 'reading',
      title: 'a reading',
      ecosystem_id: 1,
      is_feedback_immediate: false,
      description: 'a reading description',
      is_publish_requested: !ux.plan.is_published,
      tasking_plans: props.ux.course.periods.map(p => ({
        target_id: p.id,
        target_type: 'period',
        opens_at: ux.course.momentInZone(opens_at).format('YYYY-MM-DD HH:mm'),
        due_at: ux.course.momentInZone(due_at).format('YYYY-MM-DD HH:mm'),
      })),
      settings: {
        page_ids: props.ux.referenceBook.children[1].children.map(p => p.id),
      },
    });

    read.unmount();
  });

});
