import EventRow from '../../../src/screens/student-dashboard/event-row';
import { React, moment } from '../../helpers';
import Factory from '../../factories';

describe('Event Row', function() {
  const course = Factory.course();
  let regularRow = null;
  let deletedRow = null;
  let deletedNotStartedRow = null;

  beforeEach(function() {
    const regular = (
      <EventRow
        className="testing"
        event={Factory.studentDashboardTask()}
        course={course} />
    );
    const deleted = (
      <EventRow
        className=""
        event={Factory.studentDashboardTask({ is_deleted: true })}
        course={course} />
    );
    const deletedNotStarted = (
      <EventRow
        className=""
        event={Factory.studentDashboardTask({ is_deleted: true })}
        isCollege={false}
        course={course} />
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

  it('disallows onclick for event row if deleted and not started', function() {
    expect(deletedNotStartedRow.props.onClick).toBeFalsy();
  });

  it('shows only visible to instructors message', () => {
    const task = Factory.studentDashboardTask();
    task.opens_at = moment().add(1, 'day').toDate();
    expect(task.isOpen).toBe(false);
    task.tasks = { course: { currentRole: { isTeacherStudent: true } } };
    expect(task.isTeacherStudent).toBe(true);
    const row = mount(<EventRow event={task} course={course} />);
    expect(row.find('NotOpenNotice').text()).toContain('only visible to instructors');
    row.unmount();
  });
});
