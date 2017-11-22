import {
  computed, observable, action,
} from 'mobx';

export default class AnnotatorUX {

  @observable isSummaryVisible = false;

  @action.bound toggleSummary() {
    console.log("TOGGLE SUM")
    this.isSummaryVisible = !this.isSummaryVisible;
  }
}
