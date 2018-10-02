import EventRow from '../../../src/screens/student-dashboard/event-row';
import { Testing, _, React } from '../../components/helpers/component-testing';
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
  'complete_exercise_count': 3
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
  'complete_exercise_count': 0
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
        eventType="generic"
        course={course}
        feedback="" />
    );
    const deleted = (
      <EventRow
        className=""
        event={Factory.studentDashboardTask({ is_deleted: true })}
        eventType="generic"
        course={course}
        feedback="" />
    );
    const deletedNotStarted = (
      <EventRow
        className=""
        event={Factory.studentDashboardTask({ is_deleted: true })}
        eventType="generic"
        isCollege={false}
        course={course}
        feedback="" />
    );
    regularRow = mount(regular);
    deletedRow = mount(deleted);
    deletedNotStartedRow = mount(deletedNotStarted);
  });

  it('passes classnames to containing div for eventType', function() {
    expect(regularRow.find('.task').hasClass('generic')).to.be.true;
  });

  it('adds a deleted class for deleted tasks', function() {
    expect(deletedRow.find('.task').hasClass('deleted')).to.be.true;
  });

  it('shows the hide button when showing deleted tasks', function() {
    expect(deletedRow.find('button')).to.have.length(1);
    expect(deletedRow.find('button').hasClass('hide-task')).to.be.true;
  });

  it('shows withdrawn in due column when showing deleted tasks', function() {
    expect(deletedRow.find('.due-at').text()).to.equal('Withdrawn');
  });

  it('allows onclick for event row if deleted', function() {
    expect(deletedRow.find('a').prop('onClick')).to.not.be.falsy;
    expect(regularRow.find('a').prop('onClick')).to.not.be.falsy;
  });

  it('disallows onclick for event row if deleted and not started', function() {
    expect(deletedNotStartedRow.props.onClick).to.be.falsy;
    expect(regularRow.props.onClick).to.not.be.falsy;
  });
});
