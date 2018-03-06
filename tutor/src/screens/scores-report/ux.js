import { observable, computed, action } from 'mobx';
import bezierAnimation from '../../helpers/bezier';
import WindowSize from '../../models/window-size';
import WeightsUX from './weights-ux';
import UiSettings from 'shared/model/ui-settings';
import { first, isUndefined, clone, reverse, pick, pickBy, mapValues, concat, flow, map, partial, uniq, some, keys } from 'lodash';
import { asPercent } from '../../helpers/string';

const CELL_AVERAGES_CLOSED_SINGLE_WIDTH = 120;
const CELL_AVERAGES_SINGLE_WIDTH = 90;
const IS_AVERAGES_EXPANDED_KEY = 'is_scores_averages_expanded';
const CLOSED_TO_OPENED = [CELL_AVERAGES_CLOSED_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 5];
const OPENED_TO_CLOSED = reverse(clone(CLOSED_TO_OPENED));
const PADDING = 80;
const ROW_HEIGHT = 50;
const TABLE_PADDING = 18;
const WINDOW_HEIGHT_PADDING = 260;

const NOT_AVAILABLE_AVERAGE = 'n/a';
const PENDING_AVERAGE = '---';

const scoreKeyToType = (key) => (key.match(/(course_average|homework|reading)/)[0])

export default class ScoresReportUX {

  COLUMN_WIDTH = 170;

  ROW_HEIGHT = ROW_HEIGHT;

  windowSize = new WindowSize();

  @computed get isAveragesExpanded() {
    const isAveragesExpanded = UiSettings.get(IS_AVERAGES_EXPANDED_KEY);
    if (isUndefined(isAveragesExpanded)) {
      return true;
    }
    return isAveragesExpanded;
  }

  @computed get fromTo() {
    if (this.isAveragesExpanded) {
      return OPENED_TO_CLOSED;
    } else {
      return CLOSED_TO_OPENED;
    }
  }

  @observable averagesWidth = first(this.fromTo);
  @observable periodIndex = 0;
  @observable weights = new WeightsUX(this);

  constructor(course) {
    this.course = course;
    course.taskPlans.fetch({});
  }

  @computed get period() {
    return this.course.scores.periods.get(
      this.course.periods.active[this.periodIndex].id
    );
  }

  isAverageUnavailableByType(type) {
    return !this.course.taskPlans[type].any;
  }

  isAverageUnavailableByTypeForPeriod(type) {
    return !this.course.taskPlans[type].withPeriodId(this.period.period_id).any;
  }

  isAveragePendingByType(type) {
    return !this.course.taskPlans[type].pastDue.any;
  }

  isAveragePendingByTypeForPeriod(type) {
    return !this.course.taskPlans[type].pastDueWithPeriodId(this.period.period_id).any;
  }

  nullAverageByType(type) {
    if (this.isAverageUnavailableByTypeForPeriod(type)) {
      return NOT_AVAILABLE_AVERAGE;
    } else if (this.isAveragePendingByTypeForPeriod(type)) {
      return PENDING_AVERAGE;
    }
  }

  // what task types is course score being weighed on?
  // e.g. ['homework'] or ['homework', 'reading']
  @computed get weightTypes() {
    return flow(
      partial(pick, partial.placeholder, this.weights.WEIGHT_KEYS),
      partial(pickBy, partial.placeholder, (weight) => weight > 0),
      keys,
      partial(map, partial.placeholder, scoreKeyToType),
      uniq,
    )(this.course);
  }

  @computed get nullAverageForCourse() {
    if (some(this.weightTypes, this.isAverageUnavailableByTypeForPeriod.bind(this))) {
      return NOT_AVAILABLE_AVERAGE;
    } else if (some(this.weightTypes, this.isAveragePendingByTypeForPeriod.bind(this))) {
      return PENDING_AVERAGE;
    }
  }

  maskAverages(averages) {
    return mapValues(averages, (average, key) => {
      const type = scoreKeyToType(key);
      let nullValue;

      if (average === 0 || average === null) {
        if (type === 'course_average') {
          nullValue = this.nullAverageForCourse;
        } else {
          nullValue = this.nullAverageByType(type);
        }
      }

      return nullValue || `${asPercent(average)}%`;
    });
  }

  @computed get periodStudentsAverages() {
    const scoreKeys = [
      'course_average',
      'homework_score',
      'homework_progress',
      'reading_score',
      'reading_progress',
    ];

    return this.period.students.map((student) => {
      let averages = pick(student, scoreKeys);
      averages = this.maskAverages(averages);
      averages.student_identifier = student.student_identifier;

      return averages;
    });
  }

  @computed get periodAverages() {
    const scoreKeys = [
      'overall_course_average',
      'overall_homework_score',
      'overall_homework_progress',
      'overall_reading_score',
      'overall_reading_progress',
    ];

    const averages = pick(this.period, scoreKeys);
    return this.maskAverages(averages);
  }

  @computed get data() {
    return this.course.scores.periods.get(this.period.period_id);
  }

  @action.bound toggleAverageExpansion() {
    let onComplete = () => {
      UiSettings.set(IS_AVERAGES_EXPANDED_KEY, !this.isAveragesExpanded);
    };

    bezierAnimation({
      range: this.fromTo,
      duration: 500, // ms
      onStep: (width) => { this.averagesWidth = width; },
      onComplete,
    });
  }

  @computed get headerHeight() {
    return (this.course.isTeacher && 180) || 140;
  }

  @computed get windowHeightPadding() {
    return (this.course.isTeacher && (WINDOW_HEIGHT_PADDING + 95)) || WINDOW_HEIGHT_PADDING;
  }

  @computed get tableWidth() {
    const extraCol = this.course.isTeacher ? 1 : 0;
    const desiredWidth = this.averagesWidth +
      (this.COLUMN_WIDTH * (this.period.numAssignments + extraCol));

    return Math.min(
      desiredWidth, (this.windowSize.width - PADDING)
    );
  }

  @computed get desiredHeight() {
    return this.period.students.length * ROW_HEIGHT + this.headerHeight + TABLE_PADDING;
  }

  @computed get expectedHeight() {
    return this.windowSize.height - this.windowHeightPadding;
  }

  @computed get tableHeight() {
    return Math.min(
      this.desiredHeight, this.expectedHeight
    );
  }

}
