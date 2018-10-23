import { React } from '../../helpers/component-testing';
import _ from 'underscore';

import moment from 'moment-timezone';

import MiniEditor from '../../../../src/components/task-plan/mini-editor/editor';
import Courses from '../../../../src/models/courses-map';

import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';
import { TimeStore } from '../../../../src/flux/time';
import TimeHelper from '../../../../src/helpers/time';
import EnzymeContext from '../../helpers/enzyme-context';

import COURSE from '../../../../api/courses/1.json';
const COURSE_ID = '1';

import DATA from '../../../../api/courses/1/dashboard';

const PLAN = _.extend({
  settings: { exercise_ids: [1, 2, 3] },
}, _.findWhere(DATA.plans, { id: '7' }));

const today = moment(TimeStore.getNow()).format(TimeHelper.ISO_DATE_FORMAT);
const dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(TimeHelper.ISO_DATE_FORMAT);

PLAN.tasking_plans = _.map(PLAN.tasking_plans, function(tasking) {
  tasking = _.clone(tasking);
  tasking.opens_at = today;
  tasking.due_at = dayAfter;
  return tasking;
});

const getButtons = wrapper => ({
  publish: wrapper.find('.-publish'),
  save: wrapper.find('.-save'),
  cancel: wrapper.find('.btn.cancel'),
})
;

const fakeTerm = function() {
  const now = moment(TimeStore.getNow());
  const start = now.clone().add(1, 'year').startOf('year');
  const end = start.clone().add(6, 'months');
  return { start, end };
};

describe('TaskPlan MiniEditor wrapper', function() {
  let sandbox = {};
  let props = {};
  let options = {};

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(TaskPlanActions, 'save');
    sandbox.stub(TaskPlanActions, 'publish');
    sandbox.stub(TaskPlanStore, 'isValid', () => true);
    sandbox.stub(TaskPlanStore, 'hasChanged', () => true);
    moment.tz.setDefault('America/Chicago');
    Courses.bootstrap([COURSE], { clear: true });

    TaskPlanActions.loaded(PLAN, PLAN.id);

    const term = fakeTerm();
    options = EnzymeContext.build();
    return props = {
      id: PLAN.id,
      courseId: COURSE_ID,
      onHide: sinon.spy(),
      termStart: term.start,
      termEnd: term.end,
      handleError: sinon.spy(),
    };
  });


  afterEach(() => sandbox.restore());

  it('can update title', function() {
    sinon.stub(TaskPlanActions, 'updateTitle');
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const title = wrapper.find(`input[value=\"${PLAN.title}\"]`);
    expect(title).length.to.be(1);
    title.simulate('change', { target: { value: 'foo' } });
    expect(TaskPlanActions.updateTitle).to.have.been.calledWith(props.id, 'foo');
    return undefined;
  });

  it('hides itself when cancel is clicked', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    wrapper.find('.cancel').simulate('click');
    expect(props.onHide).to.have.been.called;
    return undefined;
  });

  it('publishes and sets button state', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const { publish, save, cancel } = getButtons(wrapper);
    sandbox.stub(TaskPlanStore, 'isSaving', () => true);
    expect(publish.text()).to.equal('Publish');
    publish.simulate('click');
    expect(TaskPlanActions.publish).to.have.been.called;

    expect(publish.text()).to.equal('Publishing…');
    expect(save.text()).to.equal('Save as Draft');
    expect( publish.prop('disabled') ).to.equal(true);
    expect( save.prop('disabled') ).to.equal(true);
    expect( cancel.prop('disabled') ).to.equal(true);
    return undefined;
  });

  it('saves as draft and sets button state', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const { publish, save, cancel } = getButtons(wrapper);

    expect(save.text()).to.equal('Save as Draft');
    sandbox.stub(TaskPlanStore, 'isSaving', () => true);
    save.simulate('click');

    expect(TaskPlanActions.save).to.have.been.called;
    expect(save.text()).to.equal('Saving…');
    expect(publish.text()).to.equal('Publish');
    expect( publish.prop('disabled') ).to.equal(true);
    expect( save.prop('disabled') ).to.equal(true);
    expect( cancel.prop('disabled') ).to.equal(true);
    return undefined;
  });

  it('hides when cancel is clicked', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const { cancel } = getButtons(wrapper);
    cancel.simulate('click');
    expect(props.onHide).to.have.been.called;
    return undefined;
  });

  it('calls handleError when server error is thrown', function() {
    const wrapper = shallow(React.createElement(MiniEditor, Object.assign({}, props )));
    TaskPlanStore.emit('errored', { status: 404, statusMessage: 'There\'s been an error', config: { method: 'GET' } });
    expect(props.handleError).to.have.been.called;
    return undefined;
  });

  it('renders error when server error is thrown', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    TaskPlanStore.emit('errored', { status: 404, statusMessage: 'There\'s been an error', config: { method: 'POST' } });
    expect(wrapper.find('ServerErrorMessage')).length.to.be(1);
    return undefined;
  });

  return it('limits opens date and due date to term dates', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const datePickers = wrapper.find('DatePicker');

    expect(datePickers.at(0).props().minDate.isSame(props.termStart, 'day')).to.equal(true);
    expect(datePickers.at(1).props().maxDate.isSame(props.termEnd, 'day')).to.equal(true);
    return undefined;
  });
});
