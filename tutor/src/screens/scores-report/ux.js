import { observable, computed, action } from 'mobx';
import bezierAnimation from '../../helpers/bezier';
import WindowSize from '../../models/window-size';
import WeightsUX from './weights-ux';

import { UiSettings } from 'shared';
import { first, isUndefined, clone, reverse } from 'lodash';

const CELL_AVERAGES_SINGLE_WIDTH = 90;
const IS_AVERAGES_EXPANDED_KEY = 'is_scores_averages_expanded';
const CLOSED_TO_OPENED = [CELL_AVERAGES_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 5];
const OPENED_TO_CLOSED = reverse(clone(CLOSED_TO_OPENED));
const PADDING = 50;

export default class ScoresReportUX {

  COLUMN_WIDTH = 170;

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

  @computed get tableWidth() {
    const desiredWidth = this.averagesWidth +
      (this.COLUMN_WIDTH * (this.period.numAssignments + 1));
    return Math.min(
      desiredWidth, (this.windowSize.width - PADDING)
    );
  }

}
