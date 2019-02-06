import EventRow from '../../../src/screens/student-dashboard/event-row';
import { React } from '../../helpers';
import Factory from '../../factories';

const EVENT = {
  'id': '118',
  'title': 'Read Chapter 1',
  'opens_at': (new Date(Date.now() - (1000 * 3600 * 24))).toString(),
  'due_at': '2016-05-19T12:00:00.000Z',
  'last_worked_at': '2016-05-19T11:59:00.000Z',
  'type': 'reading',
  'complete': true,
  'is_deleted': false,
  'exercise_count': 3,
  'complete_exercise_count': 3,
};

const DELETED_EVENT = {
  'id': '118',
  'title': 'Read Chapter 1',
  'opens_at': '2016-05-16T05:01:00.000Z',
  'due_at': '2016-05-19T12:00:00.000Z',
  'last_worked_at': '2016-05-19T11:59:00.000Z',
  'type': 'reading',
  'complete': true,
  'is_deleted': true,
  'exercise_count': 3,
  'complete_exercise_count': 3,
  'hide': jest.fn(),
};

const DELETED_NOT_STARTED_EVENT = {
  'id': '118',
  'title': 'Read Chapter 1',
  'opens_at': '2016-05-16T05:01:00.000Z',
  'due_at': '2016-05-19T12:00:00.000Z',
  'last_worked_at': '2016-05-19T11:59:00.000Z',
  'type': 'reading',
  'complete': true,
  'is_deleted': true,
  'exercise_count': 3,
  'complete_exercise_count': 0,
};

let regularRow = null;
let deletedRow = null;
let deletedNotStartedRow = null;

describe('Event Row', function() {
  const course = Factory.course();
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
});
