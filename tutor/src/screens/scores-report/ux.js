import { observable, computed, action } from 'mobx';
import bezierAnimation from '../../helpers/bezier';
import WindowSize from '../../models/window-size';
import WeightsUX from './weights-ux';
import UiSettings from 'shared/model/ui-settings';
import { first, isUndefined, clone, reverse } from 'lodash';

const CELL_AVERAGES_CLOSED_SINGLE_WIDTH = 120;
const CELL_AVERAGES_SINGLE_WIDTH = 100;
const IS_AVERAGES_EXPANDED_KEY = 'is_scores_averages_expanded';
const CLOSED_TO_OPENED = [CELL_AVERAGES_CLOSED_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 5];
const OPENED_TO_CLOSED = reverse(clone(CLOSED_TO_OPENED));
const PADDING = 80;
const ROW_HEIGHT = 50;
const TABLE_PADDING = 18;
const WINDOW_HEIGHT_PADDING = 260;

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
  }

  @computed get period() {
    return this.course.scores.periods.get(
      this.course.periods.active[this.periodIndex].id
    );
  }

  @computed get data() {
    return this.course.scores.periods.get(this.period.id);
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
