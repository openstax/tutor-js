import { observable, computed, action } from 'mobx';
import studentDataSorter from './scores-data-sorter';
import { sortBy, filter } from 'lodash';


export default class ScoresReportUX {

  @observable sortIndex;
  @observable sort = { key: 'name', asc: true, dataType: 'score' };

  constructor(ux) {
    this.reportUX = ux;
  }

  @computed get analytics() {
    return this.reportUX.plan.analytics.stats.find(s => s.period_id == this.reportUX.selectedPeriod.id);
  }

  @action.bound changeSortingOrder(key, dataType) {
    this.sort.asc = this.sort.key === key ? (!this.sort.asc) : false;
    this.sort.key = key;
    this.sort.dataType = dataType;
  }

  isSortedBy({ sortKey, dataType }) {
    return (this.sort.key === sortKey) && (this.sort.dataType === dataType);
  }

  @computed get studentSorter() {
    return studentDataSorter({ sort: this.sort, displayAs: this.displayAs });
  }

  @computed get sortedStudents() {
    const students = sortBy(
      filter(this.reportUX.students, 'is_active'),
      this.studentSorter,
    );
    if (!this.sort.asc) {
      students.reverse();
    }
    students.push(...this.droppedStudents);
    return students;
  }

  @computed get droppedStudents() {
    return sortBy(
      filter(this.reportUX.students, 'is_dropped'),
      this.studentSorter,
    );
  }

  @computed get questionsInfo() {
    return this.reportUX.plan.questionsInfo.map((info) => {
      info.stats = this.analytics.statsForQuestion(info.question);
      return info;
    });
  }

  @computed get headings() {
    return this.scores.data_headings;
  }


}
