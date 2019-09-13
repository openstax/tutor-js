import EventRow from '../../../src/screens/student-dashboard/event-row';
import { React, R, moment } from '../../helpers';
import Factory from '../../factories';

describe('Event Row', function() {
  const course = Factory.course();
  let regularRow = null;
  let deletedRow = null;
  let deletedNotStartedRow = null;

  beforeEach(function() {
    const regular = (
      <R><EventRow
        className="testing"
        event={Factory.studentDashboardTask()}
        course={course} /></R>
    );
    const deleted = (
      <R><EventRow
        className=""
        event={Factory.studentDashboardTask({ completed_steps_count: 10, is_deleted: true })}
        course={course} /></R>
    );
    const deletedNotStarted = (
      <R><EventRow
        className=""
        event={Factory.studentDashboardTask({ is_deleted: true })}
        isCollege={false}
        course={course} /></R>
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

  it('adds a deleted class for deleted tasks', function() {
    expect(deletedRow.find('.task').hasClass('deleted')).toBe(true);
  });

  it('shows the hide button when showing deleted tasks', function() {
    expect(deletedRow.find('button')).toHaveLength(1);
    expect(deletedRow.find('button').hasClass('hide-task')).toBe(true);
  });

  it('shows withdrawn in due column when showing deleted tasks', function() {
    expect(deletedRow.find('Col[className="due-at"]').text()).toEqual('Withdrawn');
  });

  it('allows onclick for event row if deleted', function() {
    expect(deletedRow.find('a').prop('onClick')).toBeTruthy();
    expect(regularRow.find('a').prop('onClick')).toBeTruthy();
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
    const row = mount(<R><EventRow event={task} course={course} /></R>);
    expect(row.find('NotOpenNotice').text()).toContain('only visible to instructors');
    row.unmount();
  });
});
