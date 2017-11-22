import { observable, action } from 'mobx';

export default class AnnotatorUX {

  @observable isSummaryVisible = false;

  @action.bound toggleSummary() {
    this.isSummaryVisible = !this.isSummaryVisible;
  }
}
