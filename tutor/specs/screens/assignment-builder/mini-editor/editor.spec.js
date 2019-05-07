import { React, EnzymeContext, ld } from '../../../helpers';
import moment from 'moment-timezone';
import MiniEditor from '../../../../src/screens/assignment-builder/mini-editor/editor';
import Courses from '../../../../src/models/courses-map';
import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';
import { TimeStore } from '../../../../src/flux/time';
import TimeHelper from '../../../../src/helpers/time';

import COURSE from '../../../../api/courses/1.json';
const COURSE_ID = '1';

import DATA from '../../../../api/courses/1/dashboard';

const PLAN = ld.extend({
  settings: { exercise_ids: [1, 2, 3] },
}, ld.filter(DATA.plans, { id: '7' }));

const today = moment(TimeStore.getNow()).format(TimeHelper.ISO_DATE_FORMAT);
const dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(TimeHelper.ISO_DATE_FORMAT);

PLAN.tasking_plans = ld.map(PLAN.tasking_plans, function(tasking) {
  tasking = ld.clone(tasking);
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


xdescribe('TaskPlan MiniEditor wrapper', function() {
  let sandbox = {};
  let props = {};
  let options = {};

  beforeEach(function() {
    sandbox = jest.sandbox.create();
    sandbox.stub(TaskPlanActions, 'save');
    sandbox.stub(TaskPlanActions, 'publish');
    sandbox.stub(TaskPlanStore, 'isValid', () => true);
    sandbox.stub(TaskPlanStore, 'hasChanged', () => true);
    moment.tz.setDefault('America/Chicago');
    Courses.bootstrap([COURSE], { clear: true });

    TaskPlanActions.loaded(PLAN, PLAN.id);

    const term = fakeTerm();
    options = EnzymeContext.build();
    props = {
      id: PLAN.id,
      courseId: COURSE_ID,
      onHide: jest.fn(),
      termStart: term.start,
      termEnd: term.end,
      handleError: jest.fn(),
    };
  });


  afterEach(() => sandbox.restore());

  it('can update title', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const title = wrapper.find(`input[value="${PLAN.title}"]`);
    expect(title).length.to.be(1);
    title.simulate('change', { target: { value: 'foo' } });
    expect(TaskPlanActions.updateTitle).toHaveBeenCalledWith(props.id, 'foo');
  });

  it('hides itself when cancel is clicked', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    wrapper.find('.cancel').simulate('click');
    expect(props.onHide).to.have.been.called;
  });

  it('publishes and sets button state', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const { publish, save, cancel } = getButtons(wrapper);
    sandbox.stub(TaskPlanStore, 'isSaving', () => true);
    expect(publish.text()).toEqual('Publish');
    publish.simulate('click');
    expect(TaskPlanActions.publish).to.have.been.called;

    expect(publish.text()).toEqual('Publishing…');
    expect(save.text()).toEqual('Save as Draft');
    expect( publish.prop('disabled') ).toEqual(true);
    expect( save.prop('disabled') ).toEqual(true);
    expect( cancel.prop('disabled') ).toEqual(true);
  });

  it('saves as draft and sets button state', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const { publish, save, cancel } = getButtons(wrapper);

    expect(save.text()).toEqual('Save as Draft');
    sandbox.stub(TaskPlanStore, 'isSaving', () => true);
    save.simulate('click');

    expect(TaskPlanActions.save).to.have.been.called;
    expect(save.text()).toEqual('Saving…');
    expect(publish.text()).toEqual('Publish');
    expect( publish.prop('disabled') ).toEqual(true);
    expect( save.prop('disabled') ).toEqual(true);
    expect( cancel.prop('disabled') ).toEqual(true);
  });

  it('hides when cancel is clicked', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const { cancel } = getButtons(wrapper);
    cancel.simulate('click');
    expect(props.onHide).to.have.been.called;
  });

  it('calls handleError when server error is thrown', function() {
    shallow(React.createElement(MiniEditor, Object.assign({}, props )));
    TaskPlanStore.emit('errored', { status: 404, statusMessage: 'There\'s been an error', config: { method: 'GET' } });
    expect(props.handleError).to.have.been.called;
  });

  it('renders error when server error is thrown', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    TaskPlanStore.emit('errored', { status: 404, statusMessage: 'There\'s been an error', config: { method: 'POST' } });
    expect(wrapper.find('ServerErrorMessage')).length.to.be(1);
  });

  it('limits opens date and due date to term dates', function() {
    const wrapper = mount(React.createElement(MiniEditor, Object.assign({}, props )), options);
    const datePickers = wrapper.find('DatePicker');

    expect(datePickers.at(0).props().minDate.isSame(props.termStart, 'day')).toEqual(true);
    expect(datePickers.at(1).props().maxDate.isSame(props.termEnd, 'day')).toEqual(true);
  });
});
