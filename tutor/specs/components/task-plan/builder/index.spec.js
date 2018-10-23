let React, ReactDOM, sinon, Testing;
jest.mock('../../../../src/helpers/router');

let _ = require('underscore');
const cloneDeep = require('lodash/cloneDeep');
const moment = require('moment-timezone');

const Builder = require('../../../../src/components/task-plan/builder');
const taskPlanEditingInitialize = require('../../../../src/components/task-plan/initialize-editing');
const PlanMixin = require('../../../../src/components/task-plan/plan-mixin');
const CourseDataHelper = require('../../../../src/helpers/course-data');

const { TaskPlanActions, TaskPlanStore } = require('../../../../src/flux/task-plan');
const { TaskingActions, TaskingStore } = require('../../../../src/flux/tasking');
((((({ Testing, sinon, _, React, ReactDOM } = require('../../helpers/component-testing'))))));
const { commonActions } = require('../../helpers/utilities');
const { ExtendBasePlan, PlanRenderHelper } = require('../../helpers/task-plan');

const { default: Courses } = require('../../../../src/models/courses-map');

const { TimeStore } = require('../../../../src/flux/time');
const TimeHelper = require('../../../../src/helpers/time');
const TutorDateFormat = TimeStore.getFormat();
const ISO_DATE_FORMAT = 'YYYY-MM-DD';

const twoDaysBefore = moment(TimeStore.getNow()).subtract(2, 'days').format(ISO_DATE_FORMAT);
const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(ISO_DATE_FORMAT);
const dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(ISO_DATE_FORMAT);
const nextWeek = moment(TimeStore.getNow()).add(1, 'week').format(ISO_DATE_FORMAT);

const getDateString = value => TimeHelper.getZonedMoment(value).format(TutorDateFormat);
const getISODateString = value => TimeHelper.getZonedMoment(value).format(ISO_DATE_FORMAT);

const COURSES = require('../../../../api/user/courses.json');
const COURSE_ID = '1';
const NEW_READING = ExtendBasePlan({ id: '_CREATING_1', settings: { page_ids: [] } }, false, false);
const PUBLISHED_MODEL = ExtendBasePlan({
  id: '1',
  title: 'hello',
  description: 'description',
  published_at: twoDaysBefore,
  is_published: true,
}, { opens_at: twoDaysBefore, due_at: yesterday, target_id: COURSES[0].periods[0].id });

const DUE_DATE_INPUT_SELECTOR = '.-assignment-due-date .date-wrapper input';
const OPEN_DATE_INPUT_SELECTOR = '.-assignment-open-date .date-wrapper input';

const getDateValue = function(dom, type, periodId = 'all') {
  const wrapper = dom.querySelector(`.tasking-date-times[data-period-id=\"${periodId}\"]`);
  if (!wrapper) { return null; }
  const dateStr =  `${__guard__(wrapper.querySelector(`.-assignment-${type}-date .date-wrapper input`), x => x.value)} ${__guard__(wrapper.querySelector(`.-assignment-${type}-time input`), x1 => x1.value)}`;
  return moment(dateStr, 'MM/DD/YYYY hh:mm a');
};

const makeTaskingPeriodKey = function(period) {
  if (period) { return `tasking-period${period.id}`; } else { return 'all'; }
};

const helper = function(model, routerQuery) {
  const { id } = model;
  let props = { id, courseId: '1' };
  // Load the plan into the store
  TaskPlanActions.loaded(model, id);

  if (!TaskPlanStore.isNew(id)) {
    const term = CourseDataHelper.getCourseBounds(props.courseId);
    taskPlanEditingInitialize(id, props.courseId, term);
  }

  PlanMixin.props = props;
  const moreProps = PlanMixin.getStates();
  props = _.extend(props, moreProps);

  return Testing.renderComponent( Builder, { props, routerParams: {}, routerQuery });
};

const updateBuilder = function(element) {
  element.forceUpdate();
  return element.changeTaskPlan();
};

const fakePeriodDisable = function(element, disabledPeriod) {
  const fakeEvent = {
    target: {
      checked: false,
    },
  };

  const taskingRefName = makeTaskingPeriodKey(disabledPeriod);

  element.refs[taskingRefName].togglePeriodEnabled(fakeEvent);
  return updateBuilder(element);
};

const fakePeriodEnable = function(element, enabledPeriod) {
  const fakeEvent = {
    target: {
      checked: true,
    },
  };

  const taskingRefName = makeTaskingPeriodKey(disabledPeriod);

  element.refs[taskingRefName].togglePeriodEnabled(fakeEvent);
  return updateBuilder(element);
};

const setDate = function(element, model, period, date, type) {
  TaskingActions.updateDate(model.id, period, type, date);
  return updateBuilder(element);
};

const hasAnyDueDate = function(dom) {
  const availableDueDates = dom.querySelectorAll(DUE_DATE_INPUT_SELECTOR);
  return _.any(availableDueDates, dateInput => !_.isEmpty(dateInput.value));
};

const getDueDates = function(dom) {
  const availableDueDates = dom.querySelectorAll(DUE_DATE_INPUT_SELECTOR);
  return _.pluck(availableDueDates, 'value');
};

const getOpenDates = function(dom) {
  const availableDueDates = dom.querySelectorAll(OPEN_DATE_INPUT_SELECTOR);
  return _.pluck(availableDueDates, 'value');
};

describe('Task Plan Builder', function() {
  beforeEach(function() {
    TaskPlanActions.reset();
    TaskingActions.reset();
    return Courses.bootstrap(COURSES, { clear: true });
  });

  it('should load expected plan', () =>
    helper(PUBLISHED_MODEL).then(function({ dom }) {
      expect(dom.querySelector('#reading-title').value).to.equal(PUBLISHED_MODEL.title);
      const descriptionValue = dom.querySelector('.assignment-description textarea').value;
      return expect(descriptionValue).to.equal(PUBLISHED_MODEL.description);
    })
  );

  it('should allow editable periods radio if plan is not visible', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('#show-periods-radio')).to.not.be.null;
      return expect(dom.querySelector('#hide-periods-radio')).to.not.be.null;
    })
  );

  it('should not allow editable periods radio if plan is visible', () =>
    helper(PUBLISHED_MODEL).then(function({ dom, element }) {
      expect(dom.querySelector('#show-periods-radio')).to.be.null;
      expect(dom.querySelector('#hide-periods-radio')).to.be.null;
      return expect(element.props.isVisibleToStudents).to.be.true;
    })
  );

  it('should not allow editable open date if plan is visible', () =>
    helper(PUBLISHED_MODEL).then(function({ dom, element }) {
      element.setAllPeriods();
      const datepicker = dom.querySelector('.-assignment-open-date .datepicker__input-container input');
      const inputDom = dom.querySelector('.-assignment-open-date .-tutor-date-input input');

      expect(datepicker).to.be.null;
      return expect(inputDom.disabled).to.be.true;
    })
  );


  it('hides periods by default', () =>
    helper(NEW_READING).then(({ dom, element }) => expect(dom.querySelector('.tasking-plan.tutor-date-input')).to.be.null)
  );

  it('can show individual periods', () =>
    helper(NEW_READING).then(function({ dom, element }) {
      element.setIndividualPeriods();
      return expect(dom.querySelectorAll('.tasking-plan.tutor-date-input').length).to.equal(COURSES[0].periods.length);
    })
  );

  it('sorts individual periods alphanumerically', () =>
    helper(NEW_READING).then(function({ dom, element }) {
      element.setIndividualPeriods();
      const labels = _.pluck(dom.querySelectorAll('.tasking-plan label'), 'textContent');
      return expect( labels ).to.be.deep.equal(['1st', '3rd', '4th', '5th', '6th', '10th', 'AAA', 'zZZ']);
    })
  );

  it('does not load a default due at for all periods', () =>
    helper(NEW_READING).then(function({ dom, element }) {
      expect(hasAnyDueDate(dom)).to.be.false;

      element.setIndividualPeriods();
      expect(hasAnyDueDate(dom)).to.be.false;

      element.setAllPeriods();
      return expect(hasAnyDueDate(dom)).to.be.false;
    })
  );

  it('can clear due at when there is no common due at', function() {
    const onePeriod = COURSES[0].periods[0];
    const anotherPeriod = COURSES[0].periods[1];

    return helper(NEW_READING).then(function({ dom, element }) {
      //set individual periods
      element.setIndividualPeriods();

      //set due dates to be different
      setDate(element, NEW_READING, onePeriod, tomorrow, 'due');
      setDate(element, NEW_READING, anotherPeriod, dayAfter, 'due');
      expect(hasAnyDueDate(dom)).to.be.true;
      const dueDates = getDueDates(dom);

      // set all periods, due at should be cleared
      element.setAllPeriods();
      expect(hasAnyDueDate(dom)).to.be.false;

      // reset to individual, due dates should still exist
      element.setIndividualPeriods();
      expect(hasAnyDueDate(dom)).to.be.true;
      return expect(getDueDates(dom)).to.deep.equal(dueDates);
    });
  });


  it('will default to queried due date if no common due at with a due date query string', function() {
    const onePeriod = COURSES[0].periods[0];
    const anotherPeriod = COURSES[0].periods[1];

    return helper(NEW_READING, { due_at: getISODateString(dayAfter) } ).then(function({ dom, element }) {
      //set individual periods
      element.setIndividualPeriods();

      //set due dates to be different
      setDate(element, NEW_READING, onePeriod, tomorrow, 'due');
      setDate(element, NEW_READING, anotherPeriod, dayAfter, 'due');

      //set all periods
      element.setAllPeriods();

      //due at should reset to query string due at
      const dueDates = getDueDates(dom);
      return expect(getISODateString(dueDates[0])).to.be.equal(getISODateString(dayAfter));
    });
  });

  it('can update open date for all periods', () =>
    helper(NEW_READING).then(function({ dom, element }) {
      setDate(element, NEW_READING, {}, dayAfter, 'open');

      const openDates = getOpenDates(dom);
      expect(getISODateString(openDates[0])).to.be.equal(getISODateString(dayAfter));

      const { tasking_plans } = TaskPlanStore.get(NEW_READING.id);
      return _.each(tasking_plans, tasking_plan => expect(getISODateString(tasking_plan.opens_at)).to.be.equal(getISODateString(dayAfter)));
    })
  );

  it('can update due date for all periods', () =>
    helper(NEW_READING).then(function({ dom, element }) {
      setDate(element, NEW_READING, {}, dayAfter, 'due');

      const dueDates = getDueDates(dom);
      expect(getISODateString(dueDates[0])).to.be.equal(getISODateString(dayAfter));

      const { tasking_plans } = TaskPlanStore.get(NEW_READING.id);
      return _.each(tasking_plans, tasking_plan => expect(getISODateString(tasking_plan.due_at)).to.be.equal(getISODateString(dayAfter)));
    })
  );

  it('can disable individual periods', function() {
    const disabledPeriod = COURSES[0].periods[1];
    const anotherDisabledPeriod = COURSES[0].periods[7];

    return helper(NEW_READING).then(function({ dom, element }) {
      element.setIndividualPeriods();

      fakePeriodDisable(element, disabledPeriod);
      fakePeriodDisable(element, anotherDisabledPeriod);

      const { tasking_plans } = TaskPlanStore.get(NEW_READING.id);

      expect(tasking_plans).to.have.length(COURSES[0].periods.length - 2);
      return expect(_.pluck(tasking_plans, 'id')).to.not.have
        .members(_.pluck([disabledPeriod, anotherDisabledPeriod], 'id'));
    });
  });

  xit('can update open date for individual period', function() {
    const period = COURSES[0].periods[0];
    const anotherPeriod = COURSES[0].periods[2];
    const disabledPeriod = COURSES[0].periods[1];
    const anotherDisabledPeriod = COURSES[0].periods[7];

    return helper(NEW_READING).then(function({ dom, element }) {
      element.setIndividualPeriods();

      fakePeriodDisable(element, disabledPeriod);
      fakePeriodDisable(element, anotherDisabledPeriod);

      const allDueDate = getDateValue(dom, 'open');
      expect(allDueDate).to.not.be.ok;

      const dueDate = getDateValue(dom, 'open', period.id);
      return expect(getISODateString(dueDate)).to.be.equal(getISODateString(tomorrow));
    });
  });

  it('can update due date for individual period', function() {
    const period = COURSES[0].periods[0];
    const disabledPeriod = COURSES[0].periods[1];
    const anotherPeriod = COURSES[0].periods[2];

    return helper(NEW_READING).then(function({ dom, element }) {
      element.setIndividualPeriods();

      fakePeriodDisable(element, disabledPeriod);

      setDate(element, NEW_READING, anotherPeriod, dayAfter, 'due');
      setDate(element, NEW_READING, period, tomorrow, 'due');

      const allDueDate = getDateValue(dom, 'due');
      expect(allDueDate).to.not.be.ok;

      const dueDate = getDateValue(dom, 'due', period.id);
      return expect(getISODateString(dueDate)).to.be.equal(getISODateString(tomorrow));
    });
  });

  xit('sets the correct moment timezone on mount', function() {
    const courseId = COURSES[0].periods[0].id;
    return helper(NEW_READING).then(({ dom, element }) => expect([undefined, Courses.get(courseId).time_zone]).to.contain(moment().tz()));
  });

  it('name and description fields are enabled when plan is past due', () =>
    helper(PUBLISHED_MODEL).then(function({ dom }) {
      expect(dom.querySelector('#reading-title').disabled).to.be.false;
      return expect(dom.querySelector('.assignment-description textarea').disabled).to.be.false;
    })
  );

  it('sets the default due date when based on query string', () =>
    helper(NEW_READING, { due_at: getISODateString(dayAfter) } ).then(({ dom, element }) =>
      expect(getISODateString(getDateValue(dom, 'due')))
        .to.be.equal(getISODateString(dayAfter))
    )
  );

  xit('sets open_at to couse open date when the due date equals course open date', function() {
    const starts_at = moment(TimeStore.getNow()).add(1, 'week');
    const course = cloneDeep(COURSES[0]);
    const starts_at_iso = TimeHelper.getZonedMoment(starts_at).format(ISO_DATE_FORMAT);
    course.starts_at = starts_at_iso;
    course.ends_at = starts_at.clone().add(3, 'month').format(ISO_DATE_FORMAT);
    Courses.bootstrap([course], { clear: true });
    const extendedReading = {
      due_at: starts_at_iso,
      opens_at: starts_at_iso,
    };

    return helper(NEW_READING, extendedReading).then(({ dom }) =>
      expect(getISODateString(getDateValue(dom, 'open')))
        .toEqual(starts_at_iso)
    );
  });

  return it('displays default timezone as a links to settings', () =>
    helper(NEW_READING).then(function({ dom }) {
      const tz = dom.querySelector('.course-time-zone');
      expect(tz).to.exist;
      return expect(tz.textContent).to.include('Central Time');
    })
  );
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}