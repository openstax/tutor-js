import { observable, computed, action } from 'mobx';
import bezierAnimation from '../../helpers/bezier';
import WeightsUX from './weights-ux';
const CELL_AVERAGES_SINGLE_WIDTH = 80;

export default class ScoresReportUX {

  @observable averagesWidth = CELL_AVERAGES_SINGLE_WIDTH;
  @observable isAveragesExpanded = false;

  @observable weights = new WeightsUX();

  @action.bound toggleAverageExpansion() {
    const fromTo = [CELL_AVERAGES_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 5];
    let onComplete = () => {
      this.isAveragesExpanded = !this.isAveragesExpanded;
    };
    if (this.isAveragesExpanded) {
      fromTo.reverse();
    }
    bezierAnimation({
      range: fromTo,
      duration: 500, // ms
      onStep: (width) => { this.averagesWidth = width; },
      onComplete,
    });
  }

}
