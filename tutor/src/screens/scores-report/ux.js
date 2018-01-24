import { observable, computed, action } from 'mobx';
import bezierAnimation from '../../helpers/bezier';
import WeightsUX from './weights-ux';
import { UiSettings } from 'shared';
import { first, isUndefined, clone, reverse } from 'lodash';

const CELL_AVERAGES_SINGLE_WIDTH = 90;
const IS_AVERAGES_EXPANDED_KEY = 'is_scores_averages_expanded';
const CLOSED_TO_OPENED = [CELL_AVERAGES_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 5];
const OPENED_TO_CLOSED = reverse(clone(CLOSED_TO_OPENED));

export default class ScoresReportUX {

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

  @observable weights = new WeightsUX();

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

}
