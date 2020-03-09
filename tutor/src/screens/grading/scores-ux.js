import { observable, computed, action } from 'mobx';
import studentDataSorter from './scores-data-sorter';
import { sortBy, filter } from 'lodash';


export default class ScoresReportUX {

  @observable sortIndex;
  @observable sort = { key: 'name', asc: true, dataType: 'score' };

  constructor(ux) {
    this.reportUX = ux;
  }

  @computed get scores() {
    return this.reportUX.course.scores;
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

  @computed get selectedPeriod() {
    return this.scores.periods.get(this.reportUX.selectedPeriod.id);
  }

  @computed get students() {
    const students = sortBy(
      filter(this.selectedPeriod.students, s => !s.is_dropped),
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
      filter(this.reportUX.selectedPeriod.students, 'is_dropped'),
      this.studentSorter,
    );
  }

  @computed get headings() {
    return this.selectedPeriod.data_headings;
  }

}
