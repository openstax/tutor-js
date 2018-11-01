import { Testing, sinon, _ } from 'shared/specs/helpers';
import moment from 'moment';
import URLs from 'model/urls';
import Notifications from 'model/notifications';
import Poller from 'model/notifications/pollers';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe('Notifications', function() {
  beforeEach(function() {
    this.windowImpl = new FakeWindow;
    sinon.stub(Poller.prototype, 'poll');
    return sinon.spy(Poller.prototype, 'setUrl');
  });

  afterEach(function() {
    Poller.prototype.poll.restore();
    Poller.prototype.setUrl.restore();
    Notifications._reset();
    return URLs.reset();
  });

  it('polls when URL is set', function() {
    URLs.update({ accounts_api_url: 'http://localhost:2999/api' });
    Notifications.startPolling(this.windowImpl);
    expect(Poller.prototype.poll).to.have.callCount(1);
    expect(Poller.prototype.setUrl.lastCall.args).toEqual(['http://localhost:2999/api/user']);
    URLs.update({ tutor_api_url: 'http://localhost:3001/api' });
    Notifications.startPolling(this.windowImpl);
    expect(Poller.prototype.poll).to.have.callCount(2);
    return undefined;
  });


  it('can display and confirm manual notifications', function() {
    const changeListener = sinon.stub();
    const notice = { message: 'hello world', icon: 'globe' };
    Notifications.on('change', changeListener);
    Notifications.display(notice);
    expect(changeListener).to.have.been.called;

    const active = Notifications.getActive()[0];
    expect(active).to.exist;
    // should have copied the object vs mutating it
    expect(active).not.to.not.equal(notice);
    expect(active.type).to.exist;

    Notifications.acknowledge(active);
    expect(changeListener).to.have.callCount(2);
    expect(Notifications.getActive()).toBeFalsy();
    return undefined;
  });

  it('adds missing student id when course role is set', function() {
    const changeListener = sinon.stub();
    const notice = { message: 'hello world', icon: 'globe' };
    Notifications.once('change', changeListener);
    const course = { id: '1', ends_at: moment().add(1, 'day'), students: [{ role_id: '111' }] };
    const role = { id: '111', type: 'student', joined_at: '2016-01-30T01:15:43.807Z', latest_enrollment_at: '2016-01-30T01:15:43.807Z' };
    Notifications.setCourseRole(course, role);
    expect(changeListener).to.have.been.called;
    const active = Notifications.getActive()[0];
    expect(active.type).toEqual('missing_student_id');
    expect(active.course).toEqual(course);
    expect(active.role).toEqual(role);
    return undefined;
  });

  it('clears old notices when course role is set', function() {
    const changeListener = sinon.stub();
    Notifications.setCourseRole(
      { id: '1', students: [{ role_id: '111' }], ends_at: '2011-11-11T01:15:43.807Z' },
      { id: '111' }
    );
    expect(Notifications.getActive()).toHaveLength(1);
    expect(Notifications.getActive()[0].type).toEqual('course_has_ended');
    Notifications.setCourseRole(
      { id: '1', students: [{ role_id: '111' }], ends_at: moment().add('1 month').toISOString() },
      { id: '111' }
    );
    expect(Notifications.getActive()).toHaveLength(0);
    return undefined;
  });


  it('adds course has ended when course role is set', function() {
    const changeListener = sinon.stub();
    const notice = { message: 'hello world', icon: 'globe' };
    Notifications.once('change', changeListener);
    const course = { id: '1', students: [{ role_id: '111' }], ends_at: '2011-11-11T01:15:43.807Z' };
    Notifications.setCourseRole(course, { id: '111' });
    expect(changeListener).to.have.been.called;
    const active = Notifications.getActive()[0];
    expect(active.type).toEqual('course_has_ended');
    return undefined;
  });

  return it('prevents duplicates from being displayed', function() {
    const notice = { id: '1', type: 'status' };
    Notifications.display(notice);
    Notifications.display(notice);
    expect(Notifications.getActive()).to.deep.eq([notice]);
    return undefined;
  });
});
