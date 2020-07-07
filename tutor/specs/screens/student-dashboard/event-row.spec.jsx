import EventRow from '../../../src/screens/student-dashboard/event-row';
import { React, C, moment, TimeMock } from '../../helpers';
import Factory from '../../factories';

describe('Event Row', function() {
  const course = Factory.course();
  let regularRow = null;
  let deletedRow = null;
  let deletedNotStartedRow = null;

  TimeMock.setTo('2019-10-30T12:00:00.000Z');

  beforeEach(function() {
    const regular = (
      <C><EventRow
        className="testing"
        event={Factory.studentDashboardTask()}
        course={course} /></C>
    );
    const deleted = (
      <C><EventRow
        className=""
        event={Factory.studentDashboardTask({ completed_steps_count: 10, is_deleted: true })}
        course={course} /></C>
    );
    const deletedNotStarted = (
      <C><EventRow
        event={Factory.studentDashboardTask({ is_deleted: true, completed_steps_count: 0 })}
        isCollege={false}
        course={course} /></C>
    );
    regularRow = mount(regular);
    deletedRow = mount(deleted);
    deletedNotStartedRow = mount(deletedNotStarted);
  });

  afterEach(() => {
    regularRow.unmount();
    deletedRow.unmount();
    deletedNotStartedRow.unmount();
  });

  // TODO: Fix issues with CI timezone mock not working
  xit('renders and matches snapshot', () => {
    expect.snapshot(
      <C>
        <EventRow
          className="testing"
          event={Factory.studentDashboardTask()}
          course={course} />
      </C>
    ).toMatchSnapshot();
  })

  it('adds a deleted class for deleted tasks', function() {
    expect(deletedRow.find('a.task').hasClass('deleted')).toBe(true);
  });

  it('shows the hide button when showing deleted tasks', function() {
    expect(deletedRow.find('button')).toHaveLength(1);
    expect(deletedRow.find('button').hasClass('hide-task')).toBe(true);
  });

  it('shows withdrawn in due column when showing deleted tasks', function() {
    expect(deletedRow.find('DueCell').text()).toEqual('Withdrawn');
  });

  it('allows onclick for event row if deleted', function() {
    expect(deletedRow.find('a.task').prop('onClick')).toBeTruthy();
    expect(regularRow.find('a.task').prop('onClick')).toBeTruthy();
  });

  it('does not render deleted and unstarted task', () => {
    expect(deletedNotStartedRow.find('.task').exists()).toBeFalsy();
  });

  it('shows only visible to instructors message', () => {
    const task = Factory.studentDashboardTask();
    task.opens_at = moment().add(1, 'day').toDate();
    expect(task.isOpen).toBe(false);
    task.tasks = { course: { currentRole: { isTeacherStudent: true } } };
    expect(task.isTeacherStudent).toBe(true);
    const row = mount(<C><EventRow event={task} course={course} /></C>);
    expect(row.find('NotOpenNotice').text()).toContain('only visible to instructors');
    row.unmount();
  });
});
