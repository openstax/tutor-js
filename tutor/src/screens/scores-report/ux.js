import { observable, computed, action } from 'mobx';
import bezierAnimation from '../../helpers/bezier';

const CELL_AVERAGES_SINGLE_WIDTH = 80;

export default class ScoresReportUX {

  @observable averagesWidth = CELL_AVERAGES_SINGLE_WIDTH;

  @observable isAveragesExpanded = false;

  @action.bound toggleAverageExpansion() {
    const fromTo = [CELL_AVERAGES_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 3];
    let onComplete = () => {
      this.isAveragesExpanded = !this.isAveragesExpanded;
    };
    if (this.isAveragesExpanded) {
      fromTo.reverse();
    } else {
      onComplete(); // we're expanding so fire done now so the extra colums will render
      onComplete = null;
    }
    bezierAnimation({
      range: fromTo,
      duration: 500, // ms
      onStep: (width) => { this.averagesWidth = width; },
      onComplete,
    });
  }

}
